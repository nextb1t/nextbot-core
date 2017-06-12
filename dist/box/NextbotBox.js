"use strict";
var Nextbot_1 = require("../nextbot/Nextbot");
var NextbotBox = (function () {
    function NextbotBox(bsc) {
        this.nextbots = {};
        if (bsc) {
            for (var platform in bsc) {
                for (var botId in bsc[platform]) {
                    this.addBot(platform, botId, bsc[platform][botId]);
                }
            }
        }
    }
    NextbotBox.prototype.addBot = function (platform, botId, bc) {
        var newbot = new Nextbot_1.default(platform, botId, bc);
        if (!(platform in this.nextbots)) {
            this.nextbots[platform] = {};
        }
        this.nextbots[platform][botId] = newbot;
        console.log(platform + " Nextbot for " + botId + " was created");
    };
    NextbotBox.prototype.processInput = function (platform, botId, userId, key, type, params) {
        this.nextbots[platform][botId].processInput(userId, key, type, params);
    };
    return NextbotBox;
}());
exports.NextbotBox = NextbotBox;
//# sourceMappingURL=NextbotBox.js.map