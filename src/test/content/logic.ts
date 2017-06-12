import { BotLogic } from "../../index"

const botLogic: BotLogic = { 

  // we can omit GET_STARTED condition here, 
  // because it's already in _default
  _start: { next: "greeting" },
  greeting: { next: "buttonas" },
  buttonas: {
    B1: { next: "result1" },
    B2: { next: "result2" }
  },
  result1: { next: "_idle" },
  result2: { next: "_idle" },

  // transition symbol that applies for all states
  _default: {
    GET_STARTED: { next: "greeting" }
  }
}

export default botLogic