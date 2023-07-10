export interface IBrowser {
    open(): Promise<void>;
    close(): Promise<void>;
    getContent(url: string, timeout?: number): Promise<string>;
}
