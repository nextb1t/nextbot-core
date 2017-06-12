"use strict";
var botLogic = {
    _start: { next: "greeting" },
    greeting: { next: "buttonas" },
    buttonas: {
        B1: { next: "result1" },
        B2: { next: "result2" }
    },
    result1: { next: "_idle" },
    result2: { next: "_idle" },
    _default: {
        GET_STARTED: { next: "greeting" }
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = botLogic;
//# sourceMappingURL=logic.js.map