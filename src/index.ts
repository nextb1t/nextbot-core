export { IBotLogic, IBotText, IBotWait, IBotActions, IBotContent, ITrRes } from "./nextbot/ibotcontent"
import { Nextbot } from "./nextbot/nextbot"
export default Nextbot

// import BotTransitions from "./nextbot/transitions"

// import { botLogic, botText, botWait, botActions } from "./bot-content-sample"
// import { IBotLogic, IBotText, IBotWait, IBotActions, IBotContent } from "./nextbot/ibotcontent"

// let bot = new Nextbot(botLogic, botText, botWait, botActions)

// bot.on('message', (event) => {
//   switch(event.type) {
//     case 'text': 
//       console.log('>>', event.message.txt)
//       if (event.typingOn) console.log('(...)')
//       break;
//     case 'tbuttons':
//       console.log(`>> ${event.message.txt}`)
//       for (let b of event.message.tbtn) {
//         console.log(`[${b.title}]`)
//       }
//       if (event.typingOn) console.log('(...)')
//       break;
//   }
// })

// bot.start('123')

// setTimeout(() => {
//   bot.input('user-id', 'B1')
// }, 30000)

// setTimeout(() => {
//   bot.input('123', 'MENU')
// }, 30000)

