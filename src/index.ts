import * as parsers from './parsers';


const AV_URL = 'https://cars.av.by/filter?brands[0][brand]=1216&brands[0][model]=5912&brands[0][generation]=4746&price_usd[max]=1000&sort=4';


(async () => {
	const ads = await parsers.av.parseAds(AV_URL, 5);
	console.log(ads.length);
	console.log(ads);
})();
