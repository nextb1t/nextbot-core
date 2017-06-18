import { Event } from "typescript.events"
import BotTransitions from './transitions'
import { ITrResFull, IUserMessage,
  IBotLogic, IBotText, IBotWait, IBotActions } from './ibotcontent'
import { START, IDLE } from '../config'


export class UserBotFSM extends Event {
  private readonly userId: string
  private transitions: BotTransitions
  private state: string
  private waitInput: boolean

  constructor(userId: string, botLogic: IBotLogic, botText: IBotText, botWait?: IBotWait, 
    botActions?: IBotActions, platform?: string, botId?: string) {
    super()
    this.transitions = new BotTransitions(userId, botLogic, botText, botWait, botActions)
    // todo: search for the last state
    this.run(START)
  }

  private run(stateName: string) {
    console.log('-----------------------')
    console.log(`running "${stateName}"`)
    this.state = stateName
    console.log('ZZ wait input:', this.waitInput)
    if (!this.waitInput) this.tryTransition()
  }

  public procesSymbol(symbol: string, type?: string, params?: any) {
    console.log('processing symbol:', symbol)
    this.tryTransition(symbol)
  }

  private tryTransition(symbol?: string) {
    this.transitions.make(this.state, symbol)
      .then((res: ITrResFull) => {
        // console.log('tried transition:', res)
        if (res.waitBefore > 0) console.log('ZZ waiting:', res.waitBefore)
        setTimeout(() => {
          if (res.message) this.emit('message', res)
          if (this.waitInput && !res.waitInput) this.waitInput = res.waitInput
          this.waitInput = res.waitInput
          this.run(res.nextState)
        }, res.waitBefore)

    }).catch((error) => {
      console.log('ERROR:', error)
    })
  }
}

export class Nextbot extends Event {
  private readonly botLogic: IBotLogic
  private readonly botText: IBotText
  private readonly botWait: IBotWait
  private readonly botActions: IBotActions
  private readonly platform: string
  private readonly botId: string
  private userbots: { [userId: string]: UserBotFSM }

  constructor(botLogic: IBotLogic, botText: IBotText, botWait?: IBotWait, botActions?: IBotActions,
    platform?: string, botId?: string) { 
    super()
    this.botLogic = botLogic
    this.botText = botText
    this.botWait = botWait
    this.botActions = botActions
    this.platform = platform
    this.botId = botId
  }

  public start(userId: string) {
    this.findOrCreateBotFSM(userId)
  }

  private findOrCreateBotFSM(userId: string): UserBotFSM {
    if (!this.userbots) { this.userbots = {} }
    if (userId in this.userbots) { return this.userbots[userId] }

    let newbot = new UserBotFSM(userId, this.botLogic, this.botText, 
      this.botWait, this.botActions, this.platform, this.botId)
    this.userbots[userId] = newbot

    newbot.on('message', (msg) => {
      let userMsg: IUserMessage = {
        userId: msg.userId,
        type: msg.type,
        message: msg.message,
        typingOn: msg.typingOn
      }
      if (this.platform) userMsg.platform = this.platform
      if (this.botId) userMsg.botId = this.botId

      this.emit('message', userMsg)
    })

    return newbot
  }

  public input(userId: string, symbol: string, type?: string, params?: any) {
    let bot = this.findOrCreateBotFSM(userId)
    bot.procesSymbol(symbol, type, params)
  }
}

export default Nextbot