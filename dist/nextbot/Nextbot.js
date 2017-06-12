"use strict";
var log = { inline: function (str) { } };
log.inline = function (str) {
    return process.stdout.write(str);
};
var State_1 = require("./State");
var BotInstance = (function () {
    function BotInstance(platform, botId, userId, bc) {
        this.loginfo = '';
        this.loginfo += '[';
        if (platform) {
            this.platform = platform;
            this.loginfo += platform + '|';
        }
        if (botId) {
            this.botId = botId;
            this.loginfo += botId + '|';
        }
        this.userId = userId;
        this.loginfo += userId + ']::';
        this.c = bc;
        this.state = new State_1.State(State_1.START);
        console.log(this.loginfo + "----------------------\n" + this.loginfo + " running \"" + this.state + "\"");
    }
    BotInstance.prototype.run = function (state) {
        console.log(this.loginfo + "----------------------\n" + this.loginfo + " running \"" + state + "\"");
        this.state = state;
        if (!state.is(State_1.IDLE)) {
            var waitInput = this.c.botWait[state.group].wait_input;
            if (waitInput === 'no') {
                this.transition();
                return;
            }
        }
        console.log(this.loginfo + "..waiting input..");
    };
    BotInstance.prototype.transition = function (symbol) {
        var _this = this;
        var s = this.state;
        log.inline(this.loginfo + " transition from \"" + s + "\"");
        if (s.group in this.c.botLogic) {
            var sgl = this.c.botLogic[s.group];
            var trInfo = void 0;
            if ('next' in sgl || 'func' in sgl) {
                console.log(' (uncoditional)');
                trInfo = sgl;
            }
            else {
                console.log(' (conditional: ' + symbol + ')');
                if (!symbol) {
                    throw Error('Conditional transition action requires a symbol');
                }
                trInfo = sgl[symbol];
            }
            this.transitionAction(trInfo).then(function (nextState) {
                console.log(_this.loginfo + " -> " + nextState);
                _this.run(nextState);
            }).catch(function (err) { return console.log('ERROR:', err); });
        }
    };
    BotInstance.prototype.transitionAction = function (trInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if ('next' in trInfo) {
                var ns = new State_1.State(trInfo.next);
                var waitBefore = 0;
                if (_this.c.botWait[ns.group] && ('wait_before' in _this.c.botWait[ns.group])) {
                    waitBefore = _this.c.botWait[ns.group].wait_before;
                }
                else if (_this.c.botWait[State_1.DEFAULT.group] && ('wait_before' in _this.c.botWait[State_1.DEFAULT.group])) {
                    waitBefore = _this.c.botWait[State_1.DEFAULT.group].wait_before;
                }
                if (waitBefore)
                    console.log(_this.loginfo + " waiting before transtition " + waitBefore);
                setTimeout(function () {
                    _this.defaultTransitionAction(trInfo)
                        .then(function (ns) { return resolve(ns); });
                }, waitBefore);
            }
            else if ('func' in trInfo) {
                _this.customTransitionAction(trInfo)
                    .then(function (ns) { return resolve(ns); });
            }
        });
    };
    BotInstance.prototype.defaultTransitionAction = function (trInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log(_this.loginfo + "  | default transition action ");
            var ns = new State_1.State(trInfo.next);
            if (ns.is(State_1.IDLE)) {
                resolve(State_1.IDLE);
                return;
            }
            if (!(_this.c.botText[trInfo.next])) {
                reject('Default transition should have a state item in botText');
            }
            var trBotText = _this.c.botText[trInfo.next];
            _this.sendMessage(trBotText).then(function (b) {
                resolve(new State_1.State(trInfo.next));
            }).catch(function (err) { return console.log('ERROR:', err); });
        });
    };
    BotInstance.prototype.sendMessage = function (trBotText) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if ('tbuttons' in trBotText) {
                log.inline(_this.loginfo + " >> " + trBotText.text);
                for (var _i = 0, _a = trBotText.tbuttons; _i < _a.length; _i++) {
                    var b = _a[_i];
                    log.inline(" [" + b.title + "]");
                }
                console.log();
                resolve(true);
            }
            else if ('text' in trBotText) {
                console.log(_this.loginfo + " >> " + trBotText.text);
                resolve(true);
            }
            else {
                reject('Can\'t parse botText for the default action');
            }
        });
    };
    BotInstance.prototype.customTransitionAction = function (trInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log(_this.loginfo + "  | custom transition action ");
            resolve(new State_1.State(trInfo.func));
        });
    };
    BotInstance.prototype.processInput = function (key, type, params) {
        console.log(this.loginfo + " processing input \"" + key + "\" from " + type);
        if (key === 'GET_STARTED') {
            this.transition('GET_STARTED');
        }
        if (key === 'B1') {
            this.transition('B1');
        }
        if (key === 'B2') {
            this.transition('B2');
        }
    };
    return BotInstance;
}());
var Nextbot = (function () {
    function Nextbot(platform, botId, bc) {
        this.botInstances = {};
        this.platform = platform;
        this.botId = botId;
        this.botContent = bc;
    }
    Nextbot.prototype.processInput = function (userId, key, type, params) {
        var bi = this.findOrCreateBotInstance(userId);
        bi.processInput(key, type, params);
    };
    Nextbot.prototype.findOrCreateBotInstance = function (userId) {
        if (!(userId in this.botInstances)) {
            console.log('Nextbot :: creating BotInstance for the new user:', userId);
            this.botInstances[userId] = new BotInstance(this.platform, this.botId, userId, this.botContent);
        }
        return this.botInstances[userId];
    };
    return Nextbot;
}());
exports.Nextbot = Nextbot;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Nextbot;
//# sourceMappingURL=Nextbot.js.map