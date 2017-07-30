export declare enum Level {
    err = 0,
    warn = 1,
    info = 2,
}
export declare class Logger {
    private readonly level;
    private readonly pre;
    constructor(level?: Level, pre?: string);
    err(str: any): void;
    warn(str: any): void;
    info(str: any): void;
    private at(level, str);
    static err(str: any): void;
}
export declare let log: any;
export default log;
