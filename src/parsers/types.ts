import { Browser } from '../browser';


export type CarAd = {
    id: number,
    title: string,
    params: string,
    year: string,
    mileage: string,
    location: string,
    date: string,
    photoURL: string,
    price: {
        BYN: string,
        USD: string,
    },
};


export interface IParser {
    browser: Browser;
    parseAds(url: string, adsNumber: number): Promise<CarAd[]>;
}
