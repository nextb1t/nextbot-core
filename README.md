# Nextbot 1.3.2

Nextbot is a cross-platform constructor for chatbots based on the Finite-State Machine architecture.  
You describe bot states and transitions beetween states, Nextbot does all the rest.

For questions and bug reports: https://github.com/nextb1t/nextbot-core/issues

## Get Started
```console
npm install nextbot --save
```

### Hello world Example

```javascript
const { Nextbot } = require("nextbot")

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
  console.log(`[${event.userId}] Sending "${event.message.type}" message: ${msg.message.content.txt}`)
  // you'll see: [user-id] Sending "text" message: Hello, world!
})
```

You can also see this example here: https://github.com/nextb1t/nextbot-core/blob/master/examples/javascript/hello-world.js

In this example we created a Nextbot bot with one custom state **greeting**, and transition to this state sends a **text message "Hello, world!"**. This bot handles all the users. You will need to specify the User ID when sending user input to the bot. And when you'll be getting messages from the bot, you'll recieve the *userId* as a parametr.

When you send the user's first user input to the bot, it creates a bot instance for this user in the state *start* and right after this it processes the input. If you want to start bot for a specific user without sending the input, use:

```javascript
bot.start("user-id")
```

### Custom Transition Actions

Sending *Hello, world!* text above was an example of default transition action. Keyword for the default transition in botLogic is **next** and then you need to add the message for the same state in the botText.  
If you want to do something more comlicated than sending a message use **func** in botLogic. Optionally you can add some params here and some text constants for this transition in the botText.

See the example here: https://github.com/nextb1t/nextbot-core/blob/master/examples/javascript/custom-transition.js

## Typescript

Nextbot also supports typescript with _IBotLogic_, _IBotText_, _IBotWait_ and _IBotAction_ interfaces for the bot description.

```javascript
import Nextbot from 'nextbot'
```
or
```javascript
import { Nextbot, IBotLogic, IBotText, IBotWait, IBotAction } from 'nextbot'
```
