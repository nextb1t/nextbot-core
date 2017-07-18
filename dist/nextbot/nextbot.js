"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_events_1 = require("typescript.events");
const transitions_1 = require("./transitions");
const state_1 = require("./state");
const config_1 = require("../config");
class UserBotFSM extends typescript_events_1.Event {
    constructor(userId, botLogic, botText, botWait, botActions, platform, botId) {
        super();
        this.userId = userId;
        this.transitions = new transitions_1.default(userId, botLogic, botText, botWait, botActions);
        this.run(new state_1.default(config_1.START));
    }
    run(state) {
        exports.log.debug('-----------------------');
        exports.log.debug(`running "${state}"`);
        this.state = state;
        if (this.waitInput)
            exports.log.debug('.. waiting input');
        if (!this.waitInput)
            this.tryTransition();
    }
    procesSymbol(symbol, type, params) {
        exports.log.debug('processing symbol:', symbol);
        this.tryTransition(symbol);
    }
    tryTransition(symbol) {
        this.transitions.make(this.state, symbol)
            .then((res) => {
            if (res.waitBefore > 0)
                exports.log.debug('.. waiting:', res.waitBefore);
            setTimeout(() => {
                res.userId = this.userId;
                if (res.message)
                    this.emit('message', res);
                if (this.waitInput && !res.waitInput)
                    this.waitInput = res.waitInput;
                this.waitInput = res.waitInput;
                this.run(res.nextState);
            }, res.waitBefore);
        }).catch((error) => {
            console.log('ERROR:', error);
        });
    }
}
exports.UserBotFSM = UserBotFSM;
class Nextbot extends typescript_events_1.Event {
    constructor(botLogic, botText, botWait, botActions, botInfo, isDebug = false) {
        super();
        this.botLogic = botLogic;
        this.botText = botText;
        this.botWait = botWait;
        this.botActions = botActions;
        exports.log = new config_1.Logger(isDebug);
        let i = '';
        if (botInfo && 'platform' in botInfo) {
            this.platform = botInfo.platform;
            i += botInfo.platform + '|';
        }
        if (botInfo && 'botId' in botInfo) {
            this.botId = botInfo.botId;
            i += botInfo.botId;
        }
        console.log(`# API bot ${i} has been created`);
    }
    start(userId) {
        this.findOrCreateBotFSM(userId);
    }
    findOrCreateBotFSM(userId) {
        if (!this.userbots) {
            this.userbots = {};
        }
        if (userId in this.userbots) {
            return this.userbots[userId];
        }
        let newbot = new UserBotFSM(userId, this.botLogic, this.botText, this.botWait, this.botActions, this.platform, this.botId);
        this.userbots[userId] = newbot;
        newbot.on('message', (msg) => {
            let userMsg = {
                userId: msg.userId,
                type: msg.type,
                message: msg.message,
                typingOn: msg.typingOn
            };
            if (this.platform)
                userMsg.platform = this.platform;
            if (this.botId)
                userMsg.botId = this.botId;
            this.emit('message', userMsg);
        });
        return newbot;
    }
    input(userId, symbol, type, params) {
        let bot = this.findOrCreateBotFSM(userId);
        bot.procesSymbol(symbol, type, params);
    }
}
exports.Nextbot = Nextbot;
exports.default = Nextbot;
//# sourceMappingURL=nextbot.js.map