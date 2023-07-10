import { CarAd, IParser } from './types';


export const parse = async (url: string, adsNumber = Infinity): Promise<CarAd[]> => {
	return (
		[
			{
				date: '',
				title: '',
				params: '',
				photoURL: '',
				year: '',
				mileage: '',
				location: '',
				price: {
					BYN: '',
					USD: '',
				},
			},
		]
	);
};


export class Parser implements IParser {
	
}
