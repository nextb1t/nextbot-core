import BotTransitions from '../../src/nextbot/transitions'
import { ITrRes, ITrResFull,
  IBotText_Message } from '../../src/nextbot/ibotcontent'
import { START, IDLE } from '../../src/config'
import State from '../../src/nextbot/state'

///////////////////////////////////////////////////
import { botLogic, botWait, botText, botActions } from '../../src/bot-content-sample'

let errBotText = {
  question: { txt: "How are you?" },
  farawell: { txt: "Bye" }
}

let errBotLogic = {
  start: { next: "greeting" },
  noTextGreeting: { next: "question" },
  question: { next: "farawell" },
  farawell: { next: "idle" }
}


///////////////////////////////////////////////////
/////////////// class BotTransitions //////////////
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000; // 10 second timeout

describe('class BotTransitions', () => {
  let userId = '123'
  let bt = new BotTransitions(userId, botLogic, botText, botWait, botActions)
  // let errbt = new BotTransitions(errBotLogic, errBotText)

  ///////// makeUnitTransition(initState, trInfo) /////////
  test('makeUnitTransition: corner cases', async () => {
    expect.assertions(1)
    try { await bt.makeUnitTransition() }
      catch (e) { expect(e).toBe('Initial state or transition info are not specified') }
  //   try { await errbt.makeUnitTransition("start", errBotLogic.start) }
  //     catch (e) { expect(e).toBe('Default transition requires text in BotText') }
  //   try { await errbt.makeUnitTransition("state", { aye: "karamba" }) }
  //     catch (e) { expect(e).toBe('No "next" or "func" in transition logic') }
  })

  test('calcMessageType', () => {
    let mt: string = bt.calcMessageType(botText.intro)
    expect(mt).toBe('text')
    let mt2: string = bt.calcMessageType({ img: "Test" })
    expect(mt2).toBe('image')
    let mt3: string = bt.calcMessageType({ tbtn: "Test" })
    expect(mt3).toBe('tbuttons')
    try { bt.calcMessageType({ whoa: "Test" }) }
    catch(e) { expect(e).toBe('Unknown message type') }
  })

  test('parseText', () => {
    let res: IBotText_Message
    res = bt.parseText({ txt: 'test' })
    expect(res).toEqual({ txt: 'test'})
    res = bt.parseText({ txt: { def: 'test', two: 'two' }})
    expect(res).toEqual({ txt: 'test'})
    res = bt.parseText({ txt: { def: 'test', two: 'two' }}, { txt: 'two'})
    expect(res).toEqual({ txt: 'two'})
    res = bt.parseText({ txt: 'test', tbtn: [{title: 'b1', callback: 'B2'}] })
    expect(res).toEqual({ txt: 'test', tbtn: [{title: 'b1', callback: 'B2'}]})
    res = bt.parseText({ txt: ['test'] })
    expect(res).toEqual({ txt: 'test'})
    res = bt.parseText({ txt: ['test'] })
    expect(res).toEqual({ txt: 'test'})
    res = bt.parseText({ txt: { def: ['test'], two: 'two' }})
    expect(res).toEqual({ txt: 'test'})
    res = bt.parseText({ txt: { def: ['test'], two: ['two'] }}, { txt: 'two'})
    expect(res).toEqual({ txt: 'two'})
  })

  let idleState = new State(IDLE)
  let introState = new State('intro')


  test('fillRes', () => {
    expect(bt.botDefaultWait).toEqual(
      { wait_before: 1000, typing_on: false, wait_input: 'auto' })

    let res: ITrResFull = bt.fillRes({ nextState: idleState })
    expect(res).toEqual({ nextState: idleState,
      waitBefore: 0, waitInput: true, typingOn: false })

    let res2: ITrResFull = bt.fillRes({ nextState: introState })
    expect(res2).toEqual({ nextState: introState,
      waitBefore: 1000, typingOn: false, waitInput: true })

    let res3: ITrResFull = bt.fillRes({ nextState: introState, message: {txt:"test"} })
    expect(res2).toEqual({ nextState: introState,
      waitBefore: 1000, typingOn: false, waitInput: true }) // WTF?! true?!
    
  })

  // test('makeUnitTransition: start / default', async () => {
  //   expect.assertions(0)  
  //   let res: ITrRes = await bt.makeUnitTransition("start", botLogic.start)
  //   expect(res).toEqual({ nextState: "intro",
  //                         waitInput: false,
  //                         type: 'text',
  //                         message: botText.intro,
  //                         waitBefore: 1000,
  //                         typingOn: false })
  // })

  // test('makeUnitTransition: params / default', async () => {
  //   expect.assertions(1)  
  //   let res: ITrRes = await bt.makeUnitTransition("intro", botLogic.buttons.B2)
  //   expect(res).toEqual({ nextState: "param_message",
  //                         message: { txt: botText.param_message.nft },
  //                         waitInput: false,
  //                         type: 'text',
  //                         waitBefore: 1000,
  //                         typingOn: false })
  // })

  // test('makeUnitTransition: idle', async () => {
  //   expect.assertions(1)  
  //   let res: ITrRes = await bt.makeUnitTransition("success", botLogic.farawell)
  //   expect(res).toEqual({ nextState: "idle" })
  // })

  let startState = new State(START)
  let groupMessageState = new State('group_message')
  let randomState = new State('random')
  let customState = new State('custom')  
  let questionState = new State('question')
  let paramMessageState = new State('param_message')
  let buttonsState = new State('buttons')
  
  ////////////////////// make() ///////////////////  
  test('make()', async () => {
    expect.assertions(7)  

    expect(await bt.make(startState))
      .toEqual({ nextState: introState,
                 message: botText.intro, type: "text",
                 waitBefore: 1000, typingOn: false, waitInput: false })

    expect(await bt.make(introState))
      .toEqual({ nextState: groupMessageState,
                 message: botText.group_message, type: "text",
                 waitBefore: 1000, typingOn: false, waitInput: false })

    expect(await bt.make(groupMessageState))
      .toMatchObject({ nextState: randomState, type: "text",
                 waitBefore: 1000, typingOn: false, waitInput: false })

    expect(await bt.make(randomState))
      .toEqual({ nextState: questionState,
                 message: botText.question, type: "text",
                 waitBefore: 1000, typingOn: false, waitInput: false })

    expect(await bt.make(questionState))
      .toEqual({ nextState: customState,
                 message: { txt: 'Text message with some data-here and some-param' }, type: "text",
                 waitBefore: 1000, typingOn: false, waitInput: false })

    expect(await bt.make(customState))
      .toEqual({ nextState: paramMessageState,
                 message: {txt: "First time here"}, type: "text",
                 waitBefore: 1000, typingOn: false, waitInput: false })

    expect(await bt.make(paramMessageState))
      .toEqual({ nextState: buttonsState,
                 message: botText.buttons, type: "tbuttons",
                 waitBefore: 1000, typingOn: false, waitInput: true })

    // expect(await bt.make("buttons", 'B1'))
    //   .toEqual({ nextState: "success",
    //              message: botText.success, type: "text",
    //              waitBefore: 1000, typingOn: false, waitInput: false })
    // expect(await bt.make("buttons", 'B2'))
    //   .toEqual({ nextState: "param_message",
    //              message: {txt: "Second time here"}, type: "text",
    //              waitBefore: 1000, typingOn: false, waitInput: false })

    // expect(await bt.make("success"))
    //   .toEqual({ nextState: "idle",
    //              waitBefore: 0, typingOn: false, waitInput: true })

    // expect(await bt.make("idle", "MENU"))
    //   .toEqual({ nextState: "buttons",
    //              message: botText.buttons, type: 'tbuttons',
    //              waitBefore: 1000, typingOn: false, waitInput: true })
    })
})