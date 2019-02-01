interface Args {
    url: string;
    verbose: boolean;
    fullscreen: boolean;
    output: string;
    temp: string;
    force: boolean;
    timeout: number;
    device: string;
    vw: number;
    vh: number;
}
export declare const takeScreenshot: ({ url, verbose, output, temp, force, timeout, device, vw, vh, }: Args) => Promise<void>;
export {};
