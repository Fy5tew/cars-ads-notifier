import { IBrowser } from './IBrowser';
import { CarAd } from './CarAd';


export interface IParser {
    browser: IBrowser;
    parseAds(url: string, adsNumber: number): Promise<CarAd[]>;
}
