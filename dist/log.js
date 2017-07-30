"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Level;
(function (Level) {
    Level[Level["err"] = 0] = "err";
    Level[Level["warn"] = 1] = "warn";
    Level[Level["info"] = 2] = "info";
})(Level = exports.Level || (exports.Level = {}));
class Logger {
    constructor(level = Level.err, pre = '') {
        this.level = level;
        this.pre = pre;
    }
    err(str) { this.at(Level.err, str); }
    warn(str) { this.at(Level.warn, str); }
    info(str) { this.at(Level.info, str); }
    at(level, str) {
        if (this.level >= level)
            process.stdout.write(this.pre + str);
    }
    static err(str) {
    }
}
exports.Logger = Logger;
exports.log = new Logger(Level[process.env.LOGLEVEL || 'info']);
exports.default = exports.log;
//# sourceMappingURL=log.js.map