import botLogic from './content/logic'
import botTextEN from './content/text/en'
import botWait from './content/wait'
import botActions from './content/actions'

//////////////////////////////////////////
// When developer needs only one bot
import { Nextbot, BotContent } from "../index"

let myBotContent: BotContent = {
  botLogic: botLogic,
  botText: botTextEN, 
  botWait: botWait,
  botActions: botActions
}

let myBot = new Nextbot('platform', 'botId', myBotContent)

setTimeout(() => 
myBot.processInput('123', 'GET_STARTED', 'button')
, 1000)
setTimeout(() => 
myBot.processInput('123', 'B1', 'tbutton')
, 15000)


//////////////////////////////////////////
// When developer needs several bots

// import { NextbotBox, BotContentBox } from "../../src/index"

// const botsContent: BotContentBox = {
//   messenger: {
//     en: myBotContent,
//     ru: { botLogic: botLogic, 
//           botText: botTextEN, 
//           botActions: botActions,
//           botWait: botWait },
//   }
// }

// setTimeout(() => 
// bots.processInput('messenger', 'en', '123', 'GET_STARTED', 'button')
// , 1000)
// setTimeout(() => 
// bots.processInput('messenger', 'en', '123', 'B1', 'tbutton')
// , 15000)