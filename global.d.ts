import { ENV } from './src/types/ENV';


declare global {
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface ProcessEnv extends ENV {}
    }
}
