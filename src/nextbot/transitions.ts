import { IBotLogic, IBotText, IBotWait, IBotActions,
  IBotText_Message, IBotWait_Item, IBotLogic_Transition,
  ITrRes, ITrResFull } from './ibotcontent'

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

  public make(stateName: string, symbol?: string): Promise<ITrRes> {
    return new Promise((resolve, reject) => {
      console.log('::', stateName, '->')

      let trInfo: IBotLogic_Transition
      let trText: IBotText_Message | undefined

      // if from default in botLogic
      if (symbol && (DEFAULT in this.botLogic) && (symbol in this.botLogic[DEFAULT])) {
        trInfo = this.botLogic[DEFAULT][symbol]

      // if not from default
      } else {
        let trInfoData = this.botLogic[stateName]

        if (this.isConditional(trInfoData)) {
          console.log('conditional transition')
          if (!symbol || !(symbol in trInfoData)) {
            if (!symbol) console.log('need a symbol for conditional transition')
            else if (!(symbol in trInfoData)) console.log('not this symbol, keep on waiting')
            resolve({ nextState: stateName,
                      waitInput: true }); return
          }
          console.log('yay, this symbol works:', symbol)
          trInfo = this.botLogic[stateName][symbol]

        } else { 
          trInfo = this.botLogic[stateName]
          trText = (stateName in this.botText) 
            ? this.botText[stateName] : undefined 
        }
      }

      this.makeUnitTransition(stateName, trInfo).then((res) => {
        resolve(res)
      }).catch((error) => reject(error)) 
    })
  }

  isConditional(stateLogic): boolean {
    return (!('next' in stateLogic) && !('func' in stateLogic))
  }

  public makeUnitTransition(state: string, trInfo: IBotLogic_Transition): Promise<ITrResFull> {
    return new Promise((resolve, reject) => {
      
      if (!state || !trInfo)
        reject('Initial state or transition info are not specified')

      let res: ITrRes, wait: IBotWait_Item

      // Default Transition Case
      if ('next' in trInfo) {
        res = { nextState: trInfo.next }
        console.log('->', res.nextState)

        if (res.nextState !== IDLE) {
          if (res.nextState in this.botText) {
            let textData = this.botText[res.nextState]

            let textParams = ('params' in trInfo) ? trInfo.params : undefined

            let text: IBotText_Message = this.parseText(textData, textParams)
            res.message = text

            wait = (this.botWait && (res.nextState in this.botWait))
              ? this.botWait[res.nextState]
              : undefined
          } else reject('Default transition requires text in BotText')
        }

        resolve(this.fillRes(res, wait)); return

      // Custom Transiion Case
      } else if ('func' in trInfo) {
        let action = trInfo.func

        if (!this.botActions || !(action in this.botActions))
          reject('Custom transition requires action in BotAction')

        let params = ('params' in trInfo) ? trInfo.params : undefined
        let text = (('_custom' in this.botText) && (action in this.botText._custom)) 
          ? this.botText._custom[action] : undefined

        // console.log('CUSTOM', params, text, action)
        this.botActions[action](this.userId, params, text, this.platform, this.botId)
        .then((res) => { resolve(this.fillRes(res)); return })
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
    let res = prevres, botwait: IBotWait_Item = this.botDefaultWait
    
    if (res.nextState === IDLE) {
      res.waitBefore = 0; res.waitInput = true; res.typingOn = false
      return <ITrResFull>res
    }

    if (wait) {
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
    if (MESTYPES.tbuttons in mdata) {
      return 'tbuttons'
    } else if (MESTYPES.buttons in mdata) {
      return 'buttons'
    } else if (MESTYPES.image in mdata) {
      return 'image'
    } else if (MESTYPES.text in mdata) {
      return 'text'
    } else throw 'Unknown message type'
  }

  private parseText(mdata: any, params?: any): IBotText_Message {
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
      } else if (type === MESTYPES.tbuttons || (type === MESTYPES.buttons)) {
        if (Array.isArray(mdata[type])) {
        res[type] = mdata[type] 
        } else throw 'Text buttons should be an array'
      }

      // ... all other cases - TODO
    }
    // console.log('res', res)
    return res
  }
}

export default BotTransitions