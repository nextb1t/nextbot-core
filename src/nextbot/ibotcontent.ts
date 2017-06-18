export interface ITrRes {
  nextState: string, 
  waitInput?: boolean,  
  waitBefore?: number,
  typingOn?: boolean,
  message?: IBotText_Message
  type?: string
}

export interface ITrResFull {
  nextState: string, 
  waitInput: boolean,  
  waitBefore: number,
  typingOn: boolean,
  message?: IBotText_Message
  type?: string
}

export interface IUserMessage {
  userId: string,
  typingOn: boolean,
  message: IBotText_Message
  type: string,
  platform?: string,
  botId?: string
}

export interface IBotLogic {
  [state: string]: IBotLogic_Transition | {
    [symbol: string]: IBotLogic_Transition
  }
}

export interface IBotLogic_Transition {
  next?: string,
  func?: string,
  params?: any
}

export interface IBotText { [state: string]: IBotText_Message }
export interface IBotText_Message { }
interface IBotText_TextMessage extends IBotText_Message { txt: string }
interface IBotText_Button { title: string, callback: string }
interface IBotText_TButtonsMessage extends IBotText_Message 
  { txt: string, tbtn: Array<IBotText_Button> }
interface IBotText_ButtonsMessage extends IBotText_Message 
  { txt: string, btn: Array<IBotText_Button> }


export interface IBotWait { [state: string]: IBotWait_Item }
export interface IBotWait_Item {
  wait_before?: number, 
  wait_input?: string,
  typing_on?: boolean
}

export interface IBotActions {
  [action: string]: IBotActions_Function
}
interface IBotActions_Function {
  (userId: string, params?: any, text?: any,
    platform?: string, botId?: string): Promise<ITrRes>
}

export interface IBotContent {
  botLogic: IBotLogic,
  botText: IBotText,
  botWait: IBotWait,
  botActions: IBotActions
}

export default IBotContent