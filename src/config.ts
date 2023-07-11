import dotenv from 'dotenv';


dotenv.config();


// This values should be in .env file
export type ENV = {
	VIBER_API_KEY?: string, 
};


export type Config = {
	[P in keyof ENV]-?: ENV[P];  // Only required values
};


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
