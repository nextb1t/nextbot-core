"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
class State {
    constructor(sGroup, sIndex) {
        this.group = sGroup;
        if (sIndex)
            this.index = sIndex;
    }
    toString() {
        let res = this.group;
        if (this.index !== undefined)
            res += config_1.STATEDIV + this.index;
        return res;
    }
    is(state) {
        if (typeof state === 'string') {
            return (this.group === state && this.index === undefined);
        }
        else if (state instanceof State) {
            return (this.group === state.group && this.index === state.index);
        }
    }
    first(newGroup) {
        this.index = 0;
        this.group = newGroup;
    }
    next() { this.index++; }
}
exports.default = State;
//# sourceMappingURL=state.js.map