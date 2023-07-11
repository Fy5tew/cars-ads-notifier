import dotenv from 'dotenv';

import { ENV } from './types/ENV';
import { Config } from './types/Config';


dotenv.config();


const getEnv = (): ENV => {
	return {
		VIBER_API_KEY: process.env.VIBER_API_KEY,
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
