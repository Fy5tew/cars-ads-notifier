import { IBrowser } from './IBrowser';
import { CarAd } from './CarAd';


export interface IParserConstructor {
    new (browser: IBrowser): IParser;
}


export interface IParser {
    browser: IBrowser;
    parseAds(url: string, adsNumber: number): Promise<CarAd[]>;
}
