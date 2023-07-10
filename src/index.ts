import * as parsers from './parsers';


const AV_URL = 'https://cars.av.by/filter?brands[0][brand]=1216&brands[0][model]=5912&brands[0][generation]=4746&price_usd[max]=1000&sort=4';
const KUFAR_URL = 'https://auto.kufar.by/l/kupit/cars/volkswagen-passat-b3?cur=USD&prc=r%3A0%2C1000&size=30&sort=lst.d';


(async () => {
	const kufarAds = await parsers.kufar.parseAds(KUFAR_URL);
	const avAds = await parsers.av.parseAds(AV_URL);
	console.log(kufarAds.length);
	console.log(avAds.length);
	console.log(kufarAds);
	console.log(avAds);
})();
