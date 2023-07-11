import dotenv from 'dotenv';

import { ENV } from './types/ENV';
import { Config } from './types/Config';


dotenv.config();


const getEnv = (): ENV => {
	return {
		VIBER__MAIN_API_KEY: process.env.VIBER__MAIN_API_KEY,
		VIBER__DEV_API_KEY: process.env.VIBER__DEV_API_KEY,
		VIBER__ADMIN_ID: process.env.VIBER__ADMIN_ID,
	};
};


const getConfig = (env: ENV): Config => {
	for (const [key, value] of Object.entries(env)) {
		if (value === undefined) {
			throw new Error(`${key} is not defined in env`);
		}
	}
	return env as Config;
};


export const config = getConfig(getEnv());
