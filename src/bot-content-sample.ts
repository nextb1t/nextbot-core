import { IBotLogic, IBotText, IBotWait, IBotActions,
  ITrRes } from "./nextbot/ibotcontent"
import State from './nextbot/state'
import { START, IDLE, DEFAULT } from './config'

export let botText: IBotText = {
  _custom: {
    myCustomTransition: { some: "data-here" }
  },

  intro: { txt: "Hello, world!" },

  group_message: [{ txt: "Group message here" },
                  { txt: "And here" },
                  { txt: "Last One"}],

  random: { txt: ["Whoa", "Boom"] },

  question: { txt: "I'm a sample bot and who are you?" },

  param_message: { txt: { def: "First time here",
                          nft: "Second time here" } },

  buttons: { txt: "Press the button",
             tbtn: [ { title: "button-1", callback: "B1" },
                     { title: "button-2", callback: "B2" } ] },
                         
  success: { txt: "Hooray!" }
}

export let botLogic: IBotLogic = {
  start: { next: 'intro' },

  intro: { next: 'group_message' },
  group_message: { next: 'random' },

  random: { next: 'question' },
  question: { func: 'myCustomTransition', params: 'some-param' },

  custom: { next: 'param_message' },

  param_message: { next: 'buttons' },
  buttons: {
    B1: { next: 'success' },
    B2: { next: 'param_message', params: { txt: 'nft' } }
  },

  success: { next: 'idle' },

  _default: {
    GET_STARTED: { next: "intro" },
    MENU: { next: "buttons" }
  }
}

export let botWait: IBotWait = {
  _default: { wait_before: 1500, typing_on: true, wait_input: 'auto' },
  // 'auto' - doesn't wait afrer text and image messages
  // and it doesn't wait between the grouped messages
  // it waits after the button messages

  // question: { wait_input: 'yes' },
  // buttons: { wait_input: 'yes' },
  // farawell: { wait_before: 500, typing_on: false, wait_input: 'no' }
}

export let botActions: IBotActions = {
  myCustomTransition: (userId: string, params?: any, text?: any,
    platform?: string, botId?: string): Promise<ITrRes> => {

    return new Promise((resolve, reject) => {
      // console.log('CUSTOM TRANSITION:', params, text)
      let res: ITrRes = { nextState: new State('custom') }
      res.message = { txt: "Text message with some " + text.some + ' and ' + params }
      resolve(res)
    })
  }
}