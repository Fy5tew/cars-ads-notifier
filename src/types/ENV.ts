// This values should be in .env file
export type ENV = {
	PORT?: number,
	VIBER__MAIN_API_KEY?: string, 
	VIBER__DEV_API_KEY?: string,
	VIBER__ADMIN_ID?: string,
};


declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface ProcessEnv extends ENV {}
    }
}
