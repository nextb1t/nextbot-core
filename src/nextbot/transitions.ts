import { IBotLogic, IBotText, IBotWait, IBotActions,
  IBotText_Message, IBotWait_Item, IBotLogic_Transition,
  ITrRes, ITrResFull } from './ibotcontent'
import State from './state'
import { log } from './nextbot'
import { IDLE, DEFAULT, CUSTOM, MESTYPES,
  BOTWAIT_DEFAULT, BOTWAIT_INPUTAUTO } from '../config'


export class BotTransitions { 
  private readonly userId: string
  private readonly botLogic: IBotLogic
  private readonly botText: IBotText
  private readonly botWait: IBotWait | undefined
  private readonly botDefaultWait: IBotWait_Item
  private readonly botActions: IBotActions | undefined
  private readonly platform: string | undefined
  private readonly botId: string | undefined

  constructor(userId: string, botLogic: IBotLogic, botText: IBotText, botWait?: IBotWait, 
    botActions?: IBotActions, platform?: string, botId?: string) {

    this.userId = userId
    this.botLogic = botLogic
    this.botText = botText
    this.botWait = botWait
    this.botDefaultWait = this.calcDefaultWait()
    this.botActions = (botActions) ? botActions : undefined

    this.platform = platform
    this.botId = botId
  }

  public make(state: State, symbol?: string): Promise<ITrRes> {
    return new Promise((resolve, reject) => {
      log.inline(`:: ${state} -> `)

      let trInfo: IBotLogic_Transition
      // let trText: IBotText_Message | undefined

      // if from default in botLogic
      if (symbol && (DEFAULT in this.botLogic) && (symbol in this.botLogic[DEFAULT])) {
        trInfo = this.botLogic[DEFAULT][symbol]

      // if not from default
      } else {
        let trInfoData = this.botLogic[state.group]

        // checking if transition is conditional
        if (!('next' in trInfoData) && !('func' in trInfoData)) {
          log.inline('(conditional transition)')
          if (!symbol || !(symbol in trInfoData)) {
            if (!symbol) log.debug('\nneed a symbol for conditional transition')
            else if (!(symbol in trInfoData)) log.debug('\nnot this symbol, keep on waiting')
            resolve({ nextState: state,
                      waitInput: true }); return
          }
          log.inline(`: ${symbol}`)
          trInfo = this.botLogic[state.group][symbol]

        } else { 
          log.inline('(unconditional transition) ')
          trInfo = this.botLogic[state.group]
        }
      }

      // console.log(state, trInfo)
      this.makeUnitTransition(state, trInfo).then((res) => {
        resolve(res)
      }).catch((error) => reject(error)) 
    })
  }

  private makeUnitTransition(state: State, trInfo: IBotLogic_Transition): Promise<ITrResFull> {
    // console.log(`making unit transition: ${state}`, trInfo)
    return new Promise((resolve, reject) => {
      
      if (!state || !trInfo)
        reject('Initial state or transition info are not specified')

      let res: ITrRes = {}, wait: IBotWait_Item

      // Default Transition Case
      if ('next' in trInfo) {
        let nextState = state // init nextState with the current state
        let textData = this.botText[state.group] // init textData with the current state text
        let isNextGroup = Array.isArray(this.botText[trInfo.next])

        if (trInfo.next !== (IDLE)) {
        // if next in trInfo and tr is not to idle 
        // making a default unit transition with correct params

          // console.log(`('index' in state)`, ('index' in state))
          // console.log(`isNextGroup`, isNextGroup)
          // if ('index' in state) console.log(`isLastInGroup`, state.index, textData.length-1, (state.index === textData.length-1))

          // Not a gropped state or Last item
          if ((!('index' in state) && !isNextGroup)
              || (('index' in state) && (state.index === textData.length-1))) {
            // console.log('++ not a groupped state / last item')
            nextState = new State(trInfo.next)
            textData = this.botText[nextState.group]
          } else {

          // Gropped state: first or middle item
            // console.log('++ groupped state first or middle item')
            
            // first item
            if(!('index' in state) && isNextGroup) {
              // console.log('-- first item of the gropped state')
              nextState.first(trInfo.next)
              textData = this.botText[nextState.group][nextState.index]

            // midlle item
            } else if (('index' in state) && (state.index < textData.length)) {
              // console.log('-- middle item of the gropped state')
              nextState.next()
              textData = textData[nextState.index]          
            }
          } // end of nextState & textData calc

          let textParams = ('params' in trInfo) ? trInfo.params : undefined
          res.message = this.parseText(textData, textParams)

          wait = (this.botWait && (nextState.group in this.botWait))
            ? this.botWait[nextState.group]
            : undefined
          // } else reject('Default transition requires text in BotText')
        } // end of not idle

        res.nextState = nextState
        log.debug(`-> ${nextState}`)
        let filledRes: ITrResFull = this.fillRes(res, wait)
        resolve(filledRes); return

      // Custom Transiion Case
      } else if ('func' in trInfo) {
        // console.log('\n************************STATE', state)

        // Gropped messages case
        if ('index' in state) {
          // console.log('-- middle item of the gropped state', state.group, state.index)
          let nextState = state
          nextState.next()
          // console.log(nextState)
          let res = { nextState: nextState }
          let textData = this.botText[nextState.group]
          res['message'] = textData[nextState.index]

          // last elem of the group
          if (textData.length === nextState.index) { //console.log('LAST')
          } else {
            let wait = (this.botWait && (nextState.group in this.botWait))
              ? this.botWait[nextState.group]
              : undefined

            resolve(this.fillRes(res, wait)); return
          }
        }
      
        // Not a gropped state transition
        let action = trInfo.func

        if (!this.botActions || !(action in this.botActions))
          reject('Custom transition requires action in BotAction')

        let params = ('params' in trInfo) ? trInfo.params : undefined
        let text = (('_custom' in this.botText) && (action in this.botText._custom)) 
          ? this.botText._custom[action] : undefined

        // console.log('CUSTOM', params, text, action)
        // console.log(this.platform, this.botId)
        this.botActions[action](this.userId, params, text, this.platform, this.botId)
        .then((res) => { 
          log.debug(`-> ${res.nextState}`)
          res.nextState = new State(res.nextState)
          resolve(this.fillRes(res)); return })
      }
    })
  }


  private calcDefaultWait(): IBotWait_Item {
    let res = { wait_before: BOTWAIT_DEFAULT.wait_before,
                 wait_input: BOTWAIT_DEFAULT.wait_input,
                  typing_on: BOTWAIT_DEFAULT.typing_on }

    if (this.botWait && (DEFAULT in this.botWait)) {
      let dbw = this.botWait[DEFAULT]
      if ('wait_before' in dbw) { res.wait_before = dbw.wait_before }
      if ('wait_input' in dbw) { res.wait_input = dbw.wait_input }
      if ('typing_on' in dbw) { res.typing_on = dbw.typing_on }
    }

    return res
  }

  private fillRes(prevres: ITrRes, wait?: IBotWait_Item): ITrResFull {
    // console.log('fillRes', wait)
    let res = prevres, botwait: IBotWait_Item = this.botDefaultWait
    
    if (res.nextState.is(IDLE)) {
      res.waitBefore = 0; res.waitInput = true; res.typingOn = false
      return <ITrResFull>res
    }

    if (wait && wait != undefined) {
      if ('wait_before' in wait) { botwait.wait_before = wait.wait_before }
      if ('wait_input' in wait) { botwait.wait_input = wait.wait_input }
      if ('typing_on' in wait) { botwait.typing_on = wait.typing_on }
    }

    if (prevres.message) { 
      res.type = this.calcMessageType(prevres.message)
    }
    
    res.waitBefore = prevres.waitBefore ? prevres.waitBefore 
      : botwait.wait_before
    res.typingOn = prevres.typingOn ? prevres.typingOn
      : botwait.typing_on

    // if waitInput was in prev res, just keep it
    if (prevres.waitInput) { 
      res.waitInput = prevres.waitInput; return <ITrResFull>res
    } 

    // if no waitInput in prev res, send param from default
    if (botwait.wait_input === 'no') {
      res.waitInput = false; return <ITrResFull>res
    } else if (botwait.wait_input === 'yes') {
      res.waitInput = true; return <ITrResFull>res
    }

    // if default has 'auto' 
    if (!res.message) { 
      res.waitInput = BOTWAIT_INPUTAUTO['empty']; 
      return <ITrResFull>res }
    // checking the type of the message in res
    else if (res.type in BOTWAIT_INPUTAUTO) {
      res.waitInput = BOTWAIT_INPUTAUTO[res.type]; 
      return <ITrResFull>res 
    }
  }

  private calcMessageType(mdata: any): string {
    // console.log('calcMessageType', mdata)
    if (MESTYPES.tbuttons in mdata) {
      return 'tbuttons'
    } else if (MESTYPES.buttons in mdata) {
      return 'buttons'
    } else if (MESTYPES.image in mdata) {
      return 'image'
    } else if (MESTYPES.text in mdata) {
      return 'text'
    } else if (MESTYPES.generic in mdata) {
      // console.log('GENERIC!')
      return 'generic'
    } else return 'other'
  }

  private parseText(mdata: any, params?: any): IBotText_Message {
    // console.log('textData', mdata, params)
    
    let res: IBotText_Message = {}
    for (let type in mdata) {

      let toRandomize
      // checking a text field
      if (type === MESTYPES.text) {
        // if array do randomizing
        if (Array.isArray(mdata[type])) {
          toRandomize = mdata[type]

        // if object is there, check params
        } else if (typeof mdata[type] === 'object') {
          if (params && (type in params)) {
            // exchanging text with the one from param
            let n = params[type]
            if (Array.isArray(mdata[type][n])) { toRandomize = mdata[type][n] }
            else { res[type] = mdata[type][n] }
          } else {
            // if there is no params using the def element
            if ('def' in mdata[type]) {
              if (Array.isArray(mdata[type].def)) { toRandomize = mdata[type].def }
              else { res[type] = mdata[type].def }
            } else throw 'Text obj should have a default (def) item'
          }

        // text not an array and not an object
        } else {
          // check if type is valid
          res[type] = mdata[type]
        }
        // if something neeeded to be randomized
        if (toRandomize) {
          res[type] = toRandomize[Math.floor(Math.random()*toRandomize.length)]
        }

      // checking a button field
      } else if (type === MESTYPES.buttons || (type === MESTYPES.tbuttons)) {
        if (Array.isArray(mdata[type])) {
        res[type] = mdata[type] 
        } else throw 'Text buttons should be an array'
      
      } else if (type === MESTYPES.image) {
        res[type] = mdata[type]
      
      } else if (type === MESTYPES.generic) {
        if (Array.isArray(mdata[type])) {
        res[type] = mdata[type] 
        } else throw 'Generic should be an array'
      }
      // ... all other cases - TODO
    }
    // console.log('res', res)
    return res
  }
}

export default BotTransitions