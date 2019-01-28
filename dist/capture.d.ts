interface Args {
    url: string;
    verbose: boolean;
    fullscreen: boolean;
    output: string;
    timeout: number;
    device: string;
    vw: number;
    vh: number;
}
export declare const takeScreenshot: ({ url, verbose, fullscreen, output, timeout, device, vw, vh, }: Args) => Promise<void>;
export {};
