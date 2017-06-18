import BotTransitions from "./nextbot/transitions"
import { botLogic, botText, botWait, botActions } from "./bot-content-sample"
import Nextbot from "./nextbot/nextbot"

let bot = new Nextbot(botLogic, botText, botWait, botActions)

bot.start('123')

bot.on('message', (event) => {
  switch(event.type) {
    case 'text': 
      console.log('>>>', event.message.txt)
      break;
    case 'tbuttons':
      console.log(`>>> ${event.message.txt}`)
      for (let b of event.message.tbtn) {
        console.log(`[${b.title}]`)
      }
      break;
  }
})

setTimeout(() => {
  bot.input('123', 'B1')
}, 15000)

setTimeout(() => {
  bot.input('123', 'MENU')
}, 30000)