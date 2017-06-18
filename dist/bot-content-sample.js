"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botText = {
    _custom: {
        myCustomTransition: { some: "data-here" }
    },
    intro: { txt: "Hello, world!" },
    group_message: { txt: "Group messgae will be here" },
    random: { txt: ["Whoa", "Boom"] },
    question: { txt: "I'm a sample bot and who are you?" },
    param_message: { txt: { def: "First time here",
            nft: "Second time here" } },
    buttons: { txt: "Press the button",
        tbtn: [{ title: "button-1", callback: "B1" },
            { title: "button-2", callback: "B2" }] },
    success: { txt: "Hooray!" }
};
exports.botLogic = {
    start: { next: 'intro' },
    intro: { next: 'group_message' },
    group_message: { next: 'random' },
    random: { next: 'question' },
    question: { func: 'myCustomTransition', params: 'some-param' },
    custom: { next: 'param_message' },
    param_message: { next: 'buttons' },
    buttons: {
        B1: { next: 'success' },
        B2: { next: 'param_message', params: { txt: 'nft' } }
    },
    success: { next: 'idle' },
    _default: {
        GET_STARTED: { next: "intro" },
        MENU: { next: "buttons" }
    }
};
exports.botWait = {
    _default: { wait_before: 1000, typing_on: false, wait_input: 'auto' },
};
exports.botActions = {
    myCustomTransition: (userId, params, text, platform, botId) => {
        return new Promise((resolve, reject) => {
            let res = { nextState: 'custom' };
            res.message = { txt: "Text message with some " + text.some + ' and ' + params };
            resolve(res);
        });
    }
};
//# sourceMappingURL=bot-content-sample.js.map