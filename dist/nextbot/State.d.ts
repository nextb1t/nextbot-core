export declare class State {
    group: string;
    index: number | undefined;
    prevState: State;
    constructor(stateOrGroup: (string | State), stateIndex?: number);
    toString: () => string;
    change(sgroup: string, sindex?: number): void;
    is(state: State): boolean;
}
export declare const START: State;
export declare const IDLE: State;
export declare const DEFAULT: State;
