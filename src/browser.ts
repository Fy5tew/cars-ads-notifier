import puppeteer, { 
	PuppeteerLaunchOptions,
	Browser as PuppeteerBrowser,
} from 'puppeteer';


const PUPPETEER_LAUNCH_OPTIONS: PuppeteerLaunchOptions = {
	headless: 'new',
	defaultViewport: null,
	args: [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-dev-shm-usage',
		'--disable-accelerated-2d-canvas',
		'--disable-gpu',
		'--window-size=1920x1080',
		'--start-maximized',
	],
};


export class Browser {
	private browser: PuppeteerBrowser | null;

	constructor() {
		this.browser = null;
	}

	async open() {
		if (!this.browser) {
			this.browser = await puppeteer.launch(PUPPETEER_LAUNCH_OPTIONS);
		}
	}

	async close() {
		this.browser?.close();
		this.browser = null;
	}

	async getContent(url: string, timeout = 30_000): Promise<string> {
		if (!this.browser) {
			await this.open();
		}

		const page = await this.browser?.newPage();
		if (!page) {
			throw new Error('Cannot open url');
		}

		page.setDefaultTimeout(timeout);
		await page.goto(url);
		
		return await page.content();
	}
}
