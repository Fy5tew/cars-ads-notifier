export type CarAd = {
    date: string,
    title: string,
    params: string,
    photoURL: string,
    year: string,
    mileage: string,
    location: string,
    price: {
        BYN: string,
        USD: string,
    },
};


export interface IParser {
    parseAds: (url: string, adsNumber: number, closeBrowser: boolean) => Promise<CarAd[]>;
    openBrowser: () => Promise<void>;
    closeBrowser: () => Promise<void>;
}
