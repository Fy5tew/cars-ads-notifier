import { Browser } from './browser';
import { Parser as AvParser } from './parsers/av';
import { Parser as KufarParser } from './parsers/kufar';


const ADS_NUMBER = 5;
const AV_URL = 'https://cars.av.by/filter?brands[0][brand]=1216&brands[0][model]=5912&brands[0][generation]=4746&price_usd[max]=1000&sort=4';
const KUFAR_URL = 'https://auto.kufar.by/l/kupit/cars/volkswagen-passat-b3?cur=USD&prc=r%3A0%2C1000&size=30&sort=lst.d';


const parse = async () => {
	const browser = new Browser();
	const avParser = new AvParser(browser);
	const kufarParser = new KufarParser(browser);

	await browser.open();
	console.time('parsing');
	const [avAdsResult, kufarAdsResult] = await Promise.allSettled([
		avParser.parseAds(AV_URL, ADS_NUMBER),
		kufarParser.parseAds(KUFAR_URL, ADS_NUMBER),
	]);
	console.timeEnd('parsing');
	await browser.close();

	console.log('AV: ');
	if (avAdsResult.status === 'fulfilled') {
		console.log(avAdsResult.value.length, avAdsResult.value);
	}
	else {
		console.log(avAdsResult.reason);
	}

	console.log('KUFAR: ');
	if (kufarAdsResult.status === 'fulfilled') {
		console.log(kufarAdsResult.value.length, kufarAdsResult.value);
	}
	else {
		console.log(kufarAdsResult.reason);
	}


};


const main = async () => {
	console.log('start');
	console.time('parse');
	await parse();
	console.timeEnd('parse');
	console.log('finish');
};


main();
