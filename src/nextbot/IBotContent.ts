// Interfaces for BotContent

///////////////////////////// BOT LOGIC ///////////////////////
export interface BotLogic {
  [stateName: string]: BotLogic_Transition | {
    [trKey: string]: BotLogic_Transition
  }
}
export interface BotLogic_Transition {
  next?: string, func?: string }


export interface BotText {
  [stateName: string]: BotText_Message | Array<BotText_Message>
}

///////////////////////////// BOT TEXT ////////////////////////
export interface BotText_Message {
  text?: string | Array<string>,
  image?: string,
  buttons?: Array<BotText_Button>,
  tbuttons?: Array<BotText_Button> // temp buttons
}
export interface BotText_Button { title: string, callback: string }

///////////////////////////// BOT WAIT ////////////////////////
export interface BotWait {
  [stateName: string]: { 
    wait_before?: number,
    typing_on?: boolean,
    wait_input?: "no" | "any" | "auto" | "button" | "tbutton" | "textinput"
  }
}


/////////////////////////// BOT CONTENT ///////////////////////
export interface BotContent {
  readonly botLogic: BotLogic,
  readonly botText: BotText,
  readonly botActions: object,
  readonly botWait: BotWait
}