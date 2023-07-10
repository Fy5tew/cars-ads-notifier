import { JSDOM } from 'jsdom';

import { IBrowser } from '../types/IBrowser';
import { IParser } from '../types/IParser';
import { CarAd } from '../types/CarAd';

import { Browser } from '../browser';

import { getCarId } from '../utils/urls/kufar';
import { getPageURL, getPageCursor } from '../utils/urls/kufar';

import { getWrappedElementValue } from '../utils/getElementValue';
import { getObjectValue, getPrettyObjectValue } from '../utils/getObjectValue';


export const BASE_URL = 'https://auto.kufar.by';


export const parseAds = async (url: string, adsNumber = Infinity): Promise<CarAd[]> => {
	const browser = new Browser();
	await browser.open();
	const ads = await new Parser(browser).parseAds(url, adsNumber);
	await browser.close();
	return ads;
};


export class Parser implements IParser {
	browser: IBrowser;

	constructor(browser: IBrowser) {
		this.browser = browser;
	}

	async parseAds(url: string, adsNumber = Infinity): Promise<CarAd[]> {
		const parsedAds: CarAd[] = [];
		while (parsedAds.length < adsNumber) {
			const [ pageAds, nextPageCursor ] = await this.parsePage(url);

			parsedAds.push(...pageAds);

			if (!nextPageCursor) break;

			url = getPageURL(url, nextPageCursor);
		}
		return parsedAds.slice(0, adsNumber);
	}

	private async parsePage(url: string): Promise<[CarAd[], string | null]> {
		const pageContent = await this.browser.getContent(url);
		
		const dom = new JSDOM(pageContent, { runScripts: 'dangerously' });

		const nextPageCursor = getPageCursor(BASE_URL + getObjectValue({
			object: dom.window.document.querySelector('[class*="styles_pagination"] [class*="styles_link"]:last-child[class*="styles_arrow"]'),
			field: 'href',
		}));
		
		const rawAds = Array.from(dom.window.document.querySelectorAll('[data-cy="auto-listing-block"] section'));
		const parsedAds = rawAds.map((rawAd: Element): CarAd => {
			const getValue = getWrappedElementValue(rawAd, getPrettyObjectValue);
			return {
				id: getCarId(getValue({
					selector: 'a[class*="styles_wrapper"]',
					field: 'href',
				})) || 0,
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
