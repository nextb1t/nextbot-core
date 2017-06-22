const { Nextbot } = require('../../dist')

// Bot content description..
let botLogic = {
  // "start" is a system state, bot will start here
  // "idle" is a system state too, bot will be on hold in idle
  // "greeting" is our custom state
  start: { GET_STARTED: { next: "greeting" } },
  greeting: { next: "idle" }
}

let botText = {
  greeting: { txt: "Hello, world!" }
}
// ..end of the Bot Content


let bot = new Nextbot(botLogic, botText)

// sending user input to bot (symbol)
setTimeout(() => { bot.input('user-id', 'GET_STARTED') }, 2000)

// waiting for the user messages to render
bot.on('message', (event) => {
  console.log(`[${event.userId}] Sending "${event.type}" message: ${event.message.txt}`)
  // will be: [user-id] Sending "text" message: Hello, world!
})