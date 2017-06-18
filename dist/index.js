"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_content_sample_1 = require("./bot-content-sample");
const nextbot_1 = require("./nextbot/nextbot");
let bot = new nextbot_1.default(bot_content_sample_1.botLogic, bot_content_sample_1.botText, bot_content_sample_1.botWait, bot_content_sample_1.botActions);
bot.start('123');
bot.on('message', (event) => {
    switch (event.type) {
        case 'text':
            console.log('>>>', event.message.txt);
            break;
        case 'tbuttons':
            console.log(`>>> ${event.message.txt}`);
            for (let b of event.message.tbtn) {
                console.log(`[${b.title}]`);
            }
            break;
    }
});
setTimeout(() => {
    bot.input('123', 'B1');
}, 15000);
setTimeout(() => {
    bot.input('123', 'MENU');
}, 30000);
//# sourceMappingURL=index.js.map