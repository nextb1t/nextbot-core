import { Nextbot, UserBotFSM } from '../../src/nextbot/nextbot'
import { IBotLogic, IBotText, ITrResFull } from '../../src/nextbot/ibotcontent'
import { botLogic, botWait, botText, botActions } from '../../src/bot-content-sample'

let botLogicSimple: IBotLogic = { 
  start: {
    GET_STARTED: { next: "greeting" }},
  greeting: { next: "idle" }
}

let botTextSimple: IBotText = { 
  greeting: { txt: "Hi there" }
}


describe('Testing Jest', () => {
  const myMock = jest.fn();
  myMock('1');
  myMock('a', 'b');
  console.log(myMock.mock.calls);
})

describe("Class: Nextbot", () => {
  test('MAIN', async () => {
    let b = new Nextbot(botLogic, botText, botWait, botActions)
    b.start('123')
    await b.on('message', (c) => {
      expect(c).toEqual({ message: {txt: 'Hi'}})
    })
  })

  test('findOrCreateBotFSM / input', async () => {
    expect.assertions(3)
    let b = new Nextbot(botLogicSimple, botTextSimple, null, null, 'fb', 'mybot')
    let botFSM: UserBotFSM = b.findOrCreateBotFSM('234')
    expect(b.userbots).toEqual({234: botFSM})
    let botFSM2: UserBotFSM = b.findOrCreateBotFSM('234')
    expect(botFSM).toEqual(botFSM2)

    b.input('123', 'GET_STARTED')
    expect(b.userbots).not.toEqual({234: botFSM})
    botFSM.emit('message', { type: "text",
                             message: { txt: "Hi There" },
                             typingOn: false })

    b.on('message', (c) => {
      expect(c).toEqual({ userId: "123",
                          type: "text",
                          message: { txt: "Hi There" },
                          typingOn: false,
                          platform: 'fb',
                          botId: 'myBot' })
    })
  })
})

describe('class: UserBotFSM', () => {
  // test('tryTrasition more', async () => {
  //   let ub = new UserBotFSM('123', botLogic, botText, botWait, botActions)

  // })

  // test('tryTransition', async () => {
  //   expect.assertions(2)
    
  //   let ub = new UserBotFSM('123', botLogicSimple, botTextSimple)
  //   expect(ub.state).toBe('start')
  //   let res: ITrResFull = await ub.tryTransition('GET_STARTED')
  //   expect(res).toEqual({ nextState: "intro",
  //                         type: "text",
  //                         message: { txt: "Hi there" },
  //                         waitBefore: 0,
  //                         waitInput: false,
  //                         typingOn: false })
  // })
})