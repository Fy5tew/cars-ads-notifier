import { JSDOM } from 'jsdom';

import { IBrowser } from '../types/IBrowser';
import { IParser } from '../types/IParser';
import { CarAd } from '../types/CarAd';

import { getCarId } from '../utils/urls/av';
import { getNextPageURL } from '../utils/urls/av';

import { getPrettyObjectValue } from '../utils/getObjectValue';
import { getWrappedElementValue } from '../utils/getElementValue';


export const BASE_URL = 'https://cars.av.by';


export class Parser implements IParser {
	browser: IBrowser;

	constructor(browser: IBrowser) {
		this.browser = browser;
	}

	async parseAds(url: string, adsNumber = Infinity): Promise<CarAd[]> {
		const parsedAds: CarAd[] = [];

		while (parsedAds.length < adsNumber) {
			const pageAds = await this.parsePageAds(url);

			if (!pageAds.length) break;

			parsedAds.push(...pageAds);
			url = getNextPageURL(url);
		}

		return parsedAds.slice(0, adsNumber);
	}

	private async parsePageAds(url: string): Promise<CarAd[]> {
		const pageContent = await this.browser.getContent(url);
		
		const dom = new JSDOM(pageContent);

		const rawAds = Array.from(dom.window.document.querySelectorAll('.listing__items > .listing-item'));
		const parsedAds = rawAds.map((rawAd: Element): CarAd => {
			const getValue = getWrappedElementValue(rawAd, getPrettyObjectValue);
			const isFree = 'Бесплатно' === getValue({
				selector: '.listing-item__price',
				field: 'textContent',
			});
			return {
				id: getCarId(BASE_URL + getValue({
					selector: '.listing-item__link',
					field: 'href',
				})) || 0,
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
				price: isFree
					? {
						free: true,
					}
					: {
						free: false,
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
