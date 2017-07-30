export declare enum LogLevel {
    err = 0,
    warn = 1,
    info = 2,
}
export declare class Logger {
    private readonly pre;
    private readonly level;
    private curpre;
    constructor(pre?: string, level?: string);
    err(str: any): this;
    warn(str: any): this;
    info(str: any): this;
    ln(): void;
    private at(level, str);
}
export declare let log: Logger;
export default log;
