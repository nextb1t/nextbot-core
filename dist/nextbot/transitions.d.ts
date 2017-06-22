import { IBotLogic, IBotText, IBotWait, IBotActions, ITrRes } from './ibotcontent';
import State from './state';
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
    make(state: State, symbol?: string): Promise<ITrRes>;
    private makeUnitTransition(state, trInfo);
    private calcDefaultWait();
    private fillRes(prevres, wait?);
    private calcMessageType(mdata);
    private parseText(mdata, params?);
}
export default BotTransitions;
