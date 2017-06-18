import { IBotLogic, IBotText, IBotWait, IBotActions, IBotLogic_Transition, ITrRes, ITrResFull } from './ibotcontent';
export declare class BotTransitions {
    private readonly userId;
    private readonly botLogic;
    private readonly botText;
    private readonly botWait;
    private readonly botDefaultWait;
    private readonly botActions;
    private readonly platform;
    private readonly botId;
    constructor(userId: string, botLogic: IBotLogic, botText: IBotText, botWait?: IBotWait, botActions?: IBotActions, platform?: string, botId?: string);
    make(stateName: string, symbol?: string): Promise<ITrRes>;
    isConditional(stateLogic: any): boolean;
    makeUnitTransition(state: string, trInfo: IBotLogic_Transition): Promise<ITrResFull>;
    private calcDefaultWait();
    private fillRes(prevres, wait?);
    private calcMessageType(mdata);
    private parseText(mdata, params?);
}
export default BotTransitions;
