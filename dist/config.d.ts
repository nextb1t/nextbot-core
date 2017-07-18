export declare let START: string;
export declare let IDLE: string;
export declare let DEFAULT: string;
export declare let STATEDIV: string;
export declare let CUSTOM: string;
export declare let BOTWAIT_DEFAULT: {
    wait_before: number;
    typing_on: boolean;
    wait_input: string;
};
export declare let BOTWAIT_INPUTAUTO: {
    text: boolean;
    image: boolean;
    buttons: boolean;
    tbuttons: boolean;
    empty: boolean;
    other: boolean;
};
export declare let MESTYPES: {
    text: string;
    tbuttons: string;
    buttons: string;
    image: string;
};
export declare let log: {
    inline: (str: any) => void;
};
export declare class Logger {
    private readonly isDebug;
    constructor(isDebug: boolean);
    debug(str: any): void;
    inline(str: any): void;
}
