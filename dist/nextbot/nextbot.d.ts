import { Event } from "typescript.events";
import { IBotLogic, IBotText, IBotWait, IBotActions } from './ibotcontent';
export declare class UserBotFSM extends Event {
    private readonly userId;
    private transitions;
    private state;
    private waitInput;
    constructor(userId: string, botLogic: IBotLogic, botText: IBotText, botWait?: IBotWait, botActions?: IBotActions, platform?: string, botId?: string);
    private run(stateName);
    procesSymbol(symbol: string, type?: string, params?: any): void;
    private tryTransition(symbol?);
}
export declare class Nextbot extends Event {
    private readonly botLogic;
    private readonly botText;
    private readonly botWait;
    private readonly botActions;
    private readonly platform;
    private readonly botId;
    private userbots;
    constructor(botLogic: IBotLogic, botText: IBotText, botWait?: IBotWait, botActions?: IBotActions, platform?: string, botId?: string);
    start(userId: string): void;
    private findOrCreateBotFSM(userId);
    input(userId: string, symbol: string, type?: string, params?: any): void;
}
export default Nextbot;
