"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
class BotTransitions {
    constructor(userId, botLogic, botText, botWait, botActions, platform, botId) {
        this.userId = userId;
        this.botLogic = botLogic;
        this.botText = botText;
        this.botWait = botWait;
        this.botDefaultWait = this.calcDefaultWait();
        this.botActions = (botActions) ? botActions : undefined;
        this.platform = platform;
        this.botId = botId;
    }
    make(stateName, symbol) {
        return new Promise((resolve, reject) => {
            console.log('::', stateName, '->');
            let trInfo;
            let trText;
            if (symbol && (config_1.DEFAULT in this.botLogic) && (symbol in this.botLogic[config_1.DEFAULT])) {
                trInfo = this.botLogic[config_1.DEFAULT][symbol];
            }
            else {
                let trInfoData = this.botLogic[stateName];
                if (this.isConditional(trInfoData)) {
                    console.log('conditional transition');
                    if (!symbol || !(symbol in trInfoData)) {
                        if (!symbol)
                            console.log('need a symbol for conditional transition');
                        else if (!(symbol in trInfoData))
                            console.log('not this symbol, keep on waiting');
                        resolve({ nextState: stateName,
                            waitInput: true });
                        return;
                    }
                    console.log('yay, this symbol works:', symbol);
                    trInfo = this.botLogic[stateName][symbol];
                }
                else {
                    trInfo = this.botLogic[stateName];
                    trText = (stateName in this.botText)
                        ? this.botText[stateName] : undefined;
                }
            }
            this.makeUnitTransition(stateName, trInfo).then((res) => {
                resolve(res);
            }).catch((error) => reject(error));
        });
    }
    isConditional(stateLogic) {
        return (!('next' in stateLogic) && !('func' in stateLogic));
    }
    makeUnitTransition(state, trInfo) {
        return new Promise((resolve, reject) => {
            if (!state || !trInfo)
                reject('Initial state or transition info are not specified');
            let res, wait;
            if ('next' in trInfo) {
                res = { nextState: trInfo.next };
                console.log('->', res.nextState);
                if (res.nextState !== config_1.IDLE) {
                    if (res.nextState in this.botText) {
                        let textData = this.botText[res.nextState];
                        let textParams = ('params' in trInfo) ? trInfo.params : undefined;
                        let text = this.parseText(textData, textParams);
                        res.message = text;
                        wait = (this.botWait && (res.nextState in this.botWait))
                            ? this.botWait[res.nextState]
                            : undefined;
                    }
                    else
                        reject('Default transition requires text in BotText');
                }
                resolve(this.fillRes(res, wait));
                return;
            }
            else if ('func' in trInfo) {
                let action = trInfo.func;
                if (!this.botActions || !(action in this.botActions))
                    reject('Custom transition requires action in BotAction');
                let params = ('params' in trInfo) ? trInfo.params : undefined;
                let text = (('_custom' in this.botText) && (action in this.botText._custom))
                    ? this.botText._custom[action] : undefined;
                this.botActions[action](this.userId, params, text, this.platform, this.botId)
                    .then((res) => { resolve(this.fillRes(res)); return; });
            }
        });
    }
    calcDefaultWait() {
        let res = { wait_before: config_1.BOTWAIT_DEFAULT.wait_before,
            wait_input: config_1.BOTWAIT_DEFAULT.wait_input,
            typing_on: config_1.BOTWAIT_DEFAULT.typing_on };
        if (this.botWait && (config_1.DEFAULT in this.botWait)) {
            let dbw = this.botWait[config_1.DEFAULT];
            if ('wait_before' in dbw) {
                res.wait_before = dbw.wait_before;
            }
            if ('wait_input' in dbw) {
                res.wait_input = dbw.wait_input;
            }
            if ('typing_on' in dbw) {
                res.typing_on = dbw.typing_on;
            }
        }
        return res;
    }
    fillRes(prevres, wait) {
        let res = prevres, botwait = this.botDefaultWait;
        if (res.nextState === config_1.IDLE) {
            res.waitBefore = 0;
            res.waitInput = true;
            res.typingOn = false;
            return res;
        }
        if (wait) {
            if ('wait_before' in wait) {
                botwait.wait_before = wait.wait_before;
            }
            if ('wait_input' in wait) {
                botwait.wait_input = wait.wait_input;
            }
            if ('typing_on' in wait) {
                botwait.typing_on = wait.typing_on;
            }
        }
        if (prevres.message) {
            res.type = this.calcMessageType(prevres.message);
        }
        res.waitBefore = prevres.waitBefore ? prevres.waitBefore
            : botwait.wait_before;
        res.typingOn = prevres.typingOn ? prevres.typingOn
            : botwait.typing_on;
        if (prevres.waitInput) {
            res.waitInput = prevres.waitInput;
            return res;
        }
        if (botwait.wait_input === 'no') {
            res.waitInput = false;
            return res;
        }
        else if (botwait.wait_input === 'yes') {
            res.waitInput = true;
            return res;
        }
        if (!res.message) {
            res.waitInput = config_1.BOTWAIT_INPUTAUTO['empty'];
            return res;
        }
        else if (res.type in config_1.BOTWAIT_INPUTAUTO) {
            res.waitInput = config_1.BOTWAIT_INPUTAUTO[res.type];
            return res;
        }
    }
    calcMessageType(mdata) {
        if (config_1.MESTYPES.tbuttons in mdata) {
            return 'tbuttons';
        }
        else if (config_1.MESTYPES.buttons in mdata) {
            return 'buttons';
        }
        else if (config_1.MESTYPES.image in mdata) {
            return 'image';
        }
        else if (config_1.MESTYPES.text in mdata) {
            return 'text';
        }
        else
            throw 'Unknown message type';
    }
    parseText(mdata, params) {
        let res = {};
        for (let type in mdata) {
            let toRandomize;
            if (type === config_1.MESTYPES.text) {
                if (Array.isArray(mdata[type])) {
                    toRandomize = mdata[type];
                }
                else if (typeof mdata[type] === 'object') {
                    if (params && (type in params)) {
                        let n = params[type];
                        if (Array.isArray(mdata[type][n])) {
                            toRandomize = mdata[type][n];
                        }
                        else {
                            res[type] = mdata[type][n];
                        }
                    }
                    else {
                        if ('def' in mdata[type]) {
                            if (Array.isArray(mdata[type].def)) {
                                toRandomize = mdata[type].def;
                            }
                            else {
                                res[type] = mdata[type].def;
                            }
                        }
                        else
                            throw 'Text obj should have a default (def) item';
                    }
                }
                else {
                    res[type] = mdata[type];
                }
                if (toRandomize) {
                    res[type] = toRandomize[Math.floor(Math.random() * toRandomize.length)];
                }
            }
            else if (type === config_1.MESTYPES.tbuttons || (type === config_1.MESTYPES.buttons)) {
                if (Array.isArray(mdata[type])) {
                    res[type] = mdata[type];
                }
                else
                    throw 'Text buttons should be an array';
            }
        }
        return res;
    }
}
exports.BotTransitions = BotTransitions;
exports.default = BotTransitions;
//# sourceMappingURL=transitions.js.map