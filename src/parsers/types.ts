export type CarAd = {
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
    parseAds(url: string, adsNumber: number, closeBrowser: boolean): Promise<CarAd[]>;
    openBrowser(): Promise<void>;
    closeBrowser(): Promise<void>;
}
