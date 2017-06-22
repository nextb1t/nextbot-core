import State from './state';
export interface ITrRes {
    nextState?: State;
    waitInput?: boolean;
    waitBefore?: number;
    typingOn?: boolean;
    message?: IBotText_Message;
    type?: string;
}
export interface ITrResFull {
    nextState: State;
    waitInput: boolean;
    waitBefore: number;
    typingOn: boolean;
    message?: IBotText_Message;
    type?: string;
    userId?: string;
}
export interface IUserMessage {
    userId: string;
    typingOn: boolean;
    message: IBotText_Message;
    type: string;
    platform?: string;
    botId?: string;
}
export interface IBotLogic {
    [state: string]: IBotLogic_Transition | {
        [symbol: string]: IBotLogic_Transition;
    };
}
export interface IBotLogic_Transition {
    next?: string;
    func?: string;
    params?: any;
}
export interface IBotText {
    [state: string]: IBotText_Message | Array<IBotText_Message>;
}
export interface IBotText_Message {
}
export interface IBotWait {
    [state: string]: IBotWait_Item;
}
export interface IBotWait_Item {
    wait_before?: number;
    wait_input?: string;
    typing_on?: boolean;
}
export interface IBotActions {
    [action: string]: IBotActions_Function;
}
export interface IBotActions_Function {
    (userId: string, params?: any, text?: any, platform?: string, botId?: string): Promise<ITrRes>;
}
export interface IBotContent {
    botLogic: IBotLogic;
    botText: IBotText;
    botWait: IBotWait;
    botActions: IBotActions;
}
export default IBotContent;
