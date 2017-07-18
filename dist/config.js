"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.START = 'start';
exports.IDLE = 'idle';
exports.DEFAULT = '_default';
exports.STATEDIV = '_';
exports.CUSTOM = '_custom';
exports.BOTWAIT_DEFAULT = {
    wait_before: 0, typing_on: false, wait_input: 'auto'
};
exports.BOTWAIT_INPUTAUTO = {
    text: false, image: false, buttons: true, tbuttons: true, empty: true, other: false
};
exports.MESTYPES = {
    text: 'txt',
    tbuttons: 'tbtn',
    buttons: 'btn',
    image: 'img'
};
exports.log = {
    inline: function (str) {
        process.stdout.write(str);
    }
};
class Logger {
    constructor(isDebug) {
        this.isDebug = isDebug;
    }
    debug(str) {
        if (this.isDebug)
            console.log(str);
    }
    inline(str) {
        if (this.isDebug)
            process.stdout.write(str);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=config.js.map