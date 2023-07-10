import { Browser } from '../browser';

import { CarAd, IParser } from './types';


export const parse = async (url: string, adsNumber = Infinity): Promise<CarAd[]> => {
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
			return parsedAds;
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
}
