import { JSDOM } from 'jsdom';

import { Browser } from '../browser';

import { getNextPageURL } from '../urls/av';

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
			const getValue = (selector: string, field: string, remove = ''): string => {
				const element = rawAd.querySelector(selector);
				if (!element) return '';
				return Object(element)[field]?.toString()?.replace(remove, '')?.trim() || '';
			};
			return {
				title: getValue('.listing-item__title', 'textContent'),
				photoURL: getValue('.listing-item__photo > img', 'src'),
				year: getValue('.listing-item__params > div:nth-child(1)', 'textContent'),
				params: getValue('.listing-item__params > div:nth-child(2)', 'textContent'),
				mileage: getValue('.listing-item__params > div:nth-child(3)', 'textContent'),
				location: getValue('.listing-item__location', 'textContent'),
				date: getValue('.listing-item__date', 'textContent'),
				price: {
					BYN: getValue('.listing-item__price', 'textContent'),
					USD: getValue('.listing-item__priceusd', 'textContent', '≈'),
				},
			};
		});

		return parsedAds;
	}
}
