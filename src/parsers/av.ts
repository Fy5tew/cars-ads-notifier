import { JSDOM } from 'jsdom';

import { Browser } from '../browser';

import { getNextPageURL } from '../urls/av';

import { getWrappedElementValue } from '../utils/getElementValue';
import { getPrettyObjectValue } from '../utils/getObjectValue';

import { CarAd, IParser } from './types';


export const parseAds = async (url: string, adsNumber = Infinity) => {
	return new Parser().parseAds(url, adsNumber);
};


export class Parser implements IParser {
	private browser: Browser;

	constructor() {
		this.browser = new Browser;
	}

	async parseAds(url: string, adsNumber = Infinity, closeBrowser = true): Promise<CarAd[]> {
		await this.openBrowser();
		try {
			const parsedAds: CarAd[] = [];

			while (parsedAds.length < adsNumber) {
				const pageAds = await this.parsePageAds(url);

				if (!pageAds.length) break;

				parsedAds.push(...pageAds);
				url = getNextPageURL(url);
			}

			return parsedAds.slice(0, adsNumber);
		}
		finally {
			if (closeBrowser) {
				await this.closeBrowser();
			}
		}
	}

	async openBrowser() {
		await this.browser.open();
	}

	async closeBrowser() {
		await this.browser.close();
	}

	private async getPageContent(url: string): Promise<string> {
		return await this.browser.getContent(url);
	}

	private async parsePageAds(url: string): Promise<CarAd[]> {
		const pageContent = await this.getPageContent(url);
		
		const dom = new JSDOM(pageContent);

		const rawAds = Array.from(dom.window.document.querySelectorAll('.listing__items > .listing-item'));
		const parsedAds = rawAds.map((rawAd: Element): CarAd => {
			const getValue = getWrappedElementValue(rawAd, getPrettyObjectValue);
			return {
				title: getValue({
					selector: '.listing-item__title', 
					field: 'textContent',
				}),
				params: getValue({
					selector: '.listing-item__params > div:nth-child(2)', 
					field: 'textContent',
				}),
				year: getValue({
					selector: '.listing-item__params > div:nth-child(1)', 
					field: 'textContent',
				}),
				mileage: getValue({
					selector: '.listing-item__params > div:nth-child(3)', 
					field: 'textContent',
				}),
				location: getValue({
					selector: '.listing-item__location', 
					field: 'textContent',
				}),
				date: getValue({
					selector: '.listing-item__date', 
					field: 'textContent',
				}),
				photoURL: getValue({
					selector: '.listing-item__photo > img', 
					field: 'src',
				}),
				price: {
					BYN: getValue({
						selector: '.listing-item__price',
						field: 'textContent',
					}),
					USD: getValue({
						selector: '.listing-item__priceusd', 
						field: 'textContent', 
						removeParts: ['≈'],
					}),
				},
			};
		});

		return parsedAds;
	}
}
