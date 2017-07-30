const { Nextbot } = require('../../dist')

// Bot content description..
let botLogic = {
  // "start" is a system state, bot will start here
  // "idle" is a system state too, bot will be on hold in idle
  // "greeting" is our custom state
  start: { 
    GET_STARTED: { next: "greeting" },
    HELLO: { next: "idle" }
  },

  greeting: { next: "idle" },

  manage: { next: "idle"},

  _default: {
    MANAGE: { func: "manage" }
  }
}

let botText = {
  greeting: [{ txt: "Hello, world!" },
             { txt: "Hello, world2" }],

  manage: { txt: "Managing" } //-> Text
  // { txt: "Hoho" , tbtn = [{title: 'ololo', callback: "HELLO"}]} -> buttons

}
// ..end of the Bot Content



botWait = {
  _default: { wait_before: 5000, wait_input: 'on', typing: false },

  manage: { wait_before: 0 }
}

botActions = {

}


let bot = new Nextbot(botLogic, botText, null, null)
let bots = new NextbotBox()

// sending user input to bot (symbol)
setTimeout(() => { bot.input('user-id', 'GET_STARTED') }, 2000)

// waiting for the user messages to render
bot.on('message', (event) => {
  console.log(`[${event.userId}] Sending "${event.type}" message: ${event.message.txt}`)
  // will be: [user-id] Sending "text" message: Hello, world!
})

bot.input('user-id', 'HELLO')