import { Event } from "typescript.events"
import BotTransitions from './transitions'
import State from './state'
import { ITrResFull, IUserMessage,
  IBotLogic, IBotText, IBotWait, IBotActions } from './ibotcontent'
import { START, IDLE, Logger } from '../config'

export let log

export class UserBotFSM extends Event {
  private readonly userId: string
  private transitions: BotTransitions
  private state: State
  private waitInput: boolean

  constructor(userId: string, botLogic: IBotLogic, botText: IBotText, botWait?: IBotWait, 
    botActions?: IBotActions, platform?: string, botId?: string) {
    super()
    this.userId = userId
    this.transitions = new BotTransitions(userId, botLogic, botText, botWait, botActions, platform, botId)
    // todo: search for the last state
    this.run(new State(START))
  }

  private run(state: State) {
    log.debug('-----------------------')
    log.debug(`running "${state}"`)
    this.state = state
    if (this.waitInput) log.debug('.. waiting input')
    if (!this.waitInput) this.tryTransition()
  }

  public procesSymbol(symbol: string, type?: string, params?: any) {
    log.debug('processing symbol:', symbol)
    this.tryTransition(symbol)
  }

  private tryTransition(symbol?: string) {
    this.transitions.make(this.state, symbol)
      .then((res: ITrResFull) => {
        // console.log('tried transition:', res)
        if (res.waitBefore > 0) log.debug('.. waiting:', res.waitBefore)
        setTimeout(() => {
          res.userId = this.userId
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
    botInfo?: { platform?: string, botId?: string }, isDebug = false ) { 
    super()
    this.botLogic = botLogic
    this.botText = botText
    this.botWait = botWait
    this.botActions = botActions

    log = new Logger(isDebug)
    
    let i = ''
    if (botInfo && 'platform' in botInfo) {
      this.platform = botInfo.platform
      i += botInfo.platform + '|'
    }
    if (botInfo && 'botId' in botInfo) {
      this.botId = botInfo.botId
      i += botInfo.botId
    }
    console.log(`# API bot ${i} has been created`)
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