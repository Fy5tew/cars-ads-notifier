import { ENV } from './ENV';


// All values are required
export type Config = {
	[P in keyof ENV]-?: ENV[P];
};
