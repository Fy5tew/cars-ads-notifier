import { JSDOM } from 'jsdom';

import { Browser } from '../browser';

import { getPageURL, getPageCursor } from '../urls/kufar';

import { getWrappedElementValue } from '../utils/getElementValue';
import { getObjectValue, getPrettyObjectValue } from '../utils/getObjectValue';

import { CarAd, IParser } from './types';


export const BASE_URL = 'https://auto.kufar.by';


export const parseAds = async (url: string, adsNumber = Infinity): Promise<CarAd[]> => {
	return new Parser().parseAds(url, adsNumber);
};


export class Parser implements IParser {
	private browser: Browser;

	constructor() {
		this.browser = new Browser();
	}

	async parseAds(url: string, adsNumber = Infinity, closeBrowser = true): Promise<CarAd[]> {
		await this.openBrowser();
		try {
			const parsedAds: CarAd[] = [];
			while (parsedAds.length < adsNumber) {
				const [ pageAds, nextPageCursor ] = await this.parsePage(url);

				parsedAds.push(...pageAds);

				if (!nextPageCursor) break;

				url = getPageURL(url, nextPageCursor);
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

	private async getPageContent(url: string) {
		return await this.browser.getContent(url);
	}

	private async parsePage(url: string): Promise<[CarAd[], string | null]> {
		const pageContent = await this.getPageContent(url);
		
		const dom = new JSDOM(pageContent, { runScripts: 'dangerously' });

		const nextPageCursor = getPageCursor(BASE_URL + getObjectValue({
			object: dom.window.document.querySelector('[class*="styles_pagination"] [class*="styles_link"]:last-child[class*="styles_arrow"]'),
			field: 'href',
		}));
		
		const rawAds = Array.from(dom.window.document.querySelectorAll('[data-cy="auto-listing-block"] section'));
		const parsedAds = rawAds.map((rawAd: Element): CarAd => {
			const getValue = getWrappedElementValue(rawAd, getPrettyObjectValue);
			return {
				title: getValue({
					selector: '[class*="styles_title"]', 
					field: 'textContent',
				}),
				params: getValue({
					selector: '[class*="styles_params"]', 
					field: 'textContent',
				}),
				year: getValue({
					selector: '[class*="styles_year"]', 
					field: 'textContent',
				}),
				mileage: getValue({
					selector: '[class*="styles_mileage"]', 
					field: 'textContent',
				}),
				location: getValue({
					selector: '[class*="styles_region"]', 
					field: 'textContent',
				}),
				date: getValue({
					selector: '[class*="styles_image__date"]', 
					field: 'textContent',
				}),
				photoURL: getValue({
					selector: 'img[class*="styles_image"]', 
					field: 'src',
				}),
				price: {
					BYN: getValue({
						selector: '[class*="styles_price"] > span:nth-child(1)', 
						field: 'textContent',
					}),
					USD: getValue({
						selector: '[class*="styles_price"] > span:nth-child(2)', 
						field: 'textContent', 
						removeParts: ['*'],
					}),
				},
			};
		});

		return [parsedAds, nextPageCursor];
	}
}
