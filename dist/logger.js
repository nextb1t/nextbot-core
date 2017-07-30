"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["err"] = 0] = "err";
    LogLevel[LogLevel["warn"] = 1] = "warn";
    LogLevel[LogLevel["info"] = 2] = "info";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor(pre = '', level = LogLevel[process.env.LOGLEVEL || 'info']) {
        this.pre = pre;
        this.level = level;
        this.curpre = pre;
    }
    err(str) { return this.at(LogLevel.err, str); }
    warn(str) { return this.at(LogLevel.warn, str); }
    info(str) { return this.at(LogLevel.info, str); }
    ln() {
        process.stdout.write('\n');
        this.curpre = this.pre;
    }
    at(level, str) {
        if (this.level >= level) {
            process.stdout.write(this.curpre + str);
            this.curpre = '';
        }
        return this;
    }
}
exports.Logger = Logger;
exports.log = new Logger();
exports.default = exports.log;
//# sourceMappingURL=logger.js.map