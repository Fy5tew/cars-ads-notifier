import express from 'express';

import { Parser as AvParser } from './parsers/av';

import { Browser } from './browser';

import { config } from './config';


const AV_URL = 'https://cars.av.by/filter?brands[0][brand]=1216&brands[0][model]=5912&brands[0][generation]=4746&price_usd[max]=1000';


const app = express();


app.get('/', (request, response) => {
	response.send('<h1>Hello there!</h1><p>Fy5tew\'s server is running</p>');
});


app.get('/av', async (request, response) => {
	const browser = new Browser();
	const avParser = new AvParser(browser);

	await browser.open();
	const avAds = await avParser.parseAds(AV_URL);
	await browser.close();

	response.send(JSON.stringify(avAds, undefined, 4));
});


app.listen(config.PORT, () => {
	console.log(`App started at http://localhost:${config.PORT}/`);
});
