declare class State {
    group: string;
    index: number;
    constructor(sGroup: string, sIndex?: number);
    toString(): string;
    is(state: State | string): boolean;
    first(newGroup: string): void;
    next(): void;
}
export default State;
