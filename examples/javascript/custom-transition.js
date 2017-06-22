const { Nextbot } = require('../../dist')

let botLogic = {
  start: { func: "myCustomTransitionFunction",params: "Some Params" },
  customTransitionState: { next: "idle" }
}

let botText = {
  _custom: {
    customTransitionState: { more: "More Params Here" }
  }
}

let botActions = {
  // all custom transition action functions should have the same signature
  // everything except userId can be undefined
  myCustomTransitionFunction: function(userId, params, text, platform, botId) {
    // Each function should return a promise with object (res)
    // nextState in res is required, everything else is optional
    let res = { nextState: "customTransitionState" }
    res.message = { txt: "Text message with" + params + ' and ' + text.some }
    Promise.resolve(res)
  }
}


let bot = new Nextbot(botLogic, botText)

// bot.start('user-id')

bot.on('message', (event) => {
  console.log(event)
})