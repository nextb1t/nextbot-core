// Logging... TODO: move
let log = { inline: (str: string) => {} }
log.inline = (str: string) => {
  return process.stdout.write(str)
}

import { BotContent, BotLogic_Transition, BotText_Message } from './IBotContent'
import { State, START, IDLE, DEFAULT } from "./State"

/////////////////////////////////////////////////
// Nextbot (FSM) instance for a specific User
class BotInstance {
  public readonly platform: string
  public readonly botId: string
  public readonly userId: string
  private readonly c: BotContent
  private state: State
  private loginfo: string = ''
  // private uparams: object // userParams
  // private botstory: object // bot user history

  constructor(platform: string, botId: string, userId: string, bc: BotContent) {
    this.loginfo += '['
    if( platform ) { this.platform = platform; this.loginfo+= platform + '|' }
    if( botId ) { this.botId = botId; this.loginfo += botId + '|' }
    this.userId = userId
    this.loginfo += userId + ']::'
    this.c = bc
    // TOOO: Add DB loading for state and sparams
    this.state = new State(START)
    console.log(`${this.loginfo}----------------------\n${this.loginfo} running "${this.state}"`)
  }

  private run(state: State) {
    console.log(`${this.loginfo}----------------------\n${this.loginfo} running "${state}"`)
    this.state = state
    if (!state.is(IDLE)) {
      let waitInput: string = this.c.botWait[state.group].wait_input
      if (waitInput === 'no') {
        this.transition()
        return 
      }
    }
    console.log(`${this.loginfo}..waiting input..`)
  }

  private transition(symbol?: string): void {
    const s = this.state
    log.inline(`${this.loginfo} transition from "${s}"`)  

    if (s.group in this.c.botLogic) {
      const sgl = this.c.botLogic[s.group]
      // console.log('found in botLogic:', sgl)
      
      let trInfo: BotLogic_Transition
      if ('next' in sgl || 'func' in sgl) {
        console.log(' (uncoditional)')
        trInfo = sgl
      } else {
        console.log(' (conditional: '+ symbol + ')')
        if(!symbol) { throw Error('Conditional transition action requires a symbol') }
        trInfo = sgl[symbol]       
      }

      this.transitionAction(trInfo).then((nextState: State) => {
        console.log(`${this.loginfo} -> ${nextState}`)
        this.run(nextState)
      }).catch((err) => console.log('ERROR:', err))
    }

  }

  transitionAction(trInfo: BotLogic_Transition): Promise<State> {
    return new Promise((resolve, reject) => {

      if ('next' in trInfo) {
        let ns = new State(trInfo.next)
        let waitBefore = 0
        if (this.c.botWait[ns.group] && ('wait_before' in this.c.botWait[ns.group])) {
          waitBefore = this.c.botWait[ns.group].wait_before
        } else if (this.c.botWait[DEFAULT.group] && ('wait_before' in this.c.botWait[DEFAULT.group])) {
          waitBefore = this.c.botWait[DEFAULT.group].wait_before
        }
        if(waitBefore) console.log(`${this.loginfo} waiting before transtition ${waitBefore}`)
        setTimeout(() => {
          this.defaultTransitionAction(trInfo)
            .then((ns) => resolve(ns))
        }, waitBefore)
        
      } else if ('func' in trInfo) {
        this.customTransitionAction(trInfo)
          .then((ns) => resolve(ns))
      }
    })
  }

  defaultTransitionAction(trInfo: BotLogic_Transition): Promise<State> {
    return new Promise((resolve, reject) => {
      console.log(`${this.loginfo}  | default transition action `)
      let ns = new State(trInfo.next)
      if(ns.is(IDLE)) {
        resolve(IDLE)
        return
      }

      if(!(this.c.botText[trInfo.next]))
        { reject('Default transition should have a state item in botText') }

      let trBotText = this.c.botText[trInfo.next]
      this.sendMessage(trBotText).then((b) => {
        resolve(new State(trInfo.next))
      }).catch((err) => console.log('ERROR:', err))
    })
  }

  sendMessage(trBotText: BotText_Message): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if ('tbuttons' in trBotText) {
        log.inline(`${this.loginfo} >> ${trBotText.text}`)
        for(let b of trBotText.tbuttons) {
          log.inline(` [${b.title}]`)
        } console.log()
        resolve(true)
      } else if ('text' in trBotText) {
        console.log(`${this.loginfo} >> ${trBotText.text}`)
        resolve(true)
      } else {
        reject('Can\'t parse botText for the default action')
      }
    })
  }

  customTransitionAction(trInfo: BotLogic_Transition): Promise<State> {
    return new Promise((resolve, reject) => {
      console.log(`${this.loginfo}  | custom transition action `)
      resolve(new State(trInfo.func))
    })
  }

  public processInput(key: string, type: string, params?: object) {
    console.log(`${this.loginfo} processing input "${key}" from ${type}`)

    if(key === 'GET_STARTED') { this.transition('GET_STARTED') }
    if(key === 'B1') { this.transition('B1') }
    if(key === 'B2') { this.transition('B2') }
  }
}


/////////////////////////////////////////////////
// Bot for a specific platform and botId       
// Uses finit state machine blocks for content 
class Nextbot {
  private platform: string
  private botId: string
  private botContent: BotContent
  private botInstances: { [userId: string]: BotInstance  } = {}

  constructor(platform: string, botId: string, bc: BotContent) {
    this.platform = platform
    this.botId = botId
    this.botContent = bc
  }

  public processInput(userId: string, key: string, type: string, params?: object) {
    let bi = this.findOrCreateBotInstance(userId)
    bi.processInput(key, type, params)
  }

  private findOrCreateBotInstance(userId: string): BotInstance {
    // TODO: If bot instanses are empty check the DB
    if (!(userId in this.botInstances)) {
      console.log('Nextbot :: creating BotInstance for the new user:', userId)
      this.botInstances[userId] = new BotInstance(
        this.platform, this.botId, userId, this.botContent)
    }
    return this.botInstances[userId]
  }
}

export { Nextbot, BotContent }
export default Nextbot