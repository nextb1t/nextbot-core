"use strict";
var logic_1 = require("./content/logic");
var en_1 = require("./content/text/en");
var wait_1 = require("./content/wait");
var actions_1 = require("./content/actions");
var index_1 = require("../index");
var myBotContent = {
    botLogic: logic_1.default,
    botText: en_1.default,
    botWait: wait_1.default,
    botActions: actions_1.default
};
var myBot = new index_1.Nextbot('platform', 'botId', myBotContent);
setTimeout(function () {
    return myBot.processInput('123', 'GET_STARTED', 'button');
}, 1000);
setTimeout(function () {
    return myBot.processInput('123', 'B1', 'tbutton');
}, 15000);
//# sourceMappingURL=index.js.map