import Nextbot from '../nextbot/Nextbot'
import { BotContent } from '../nextbot/IBotContent'

export interface BotContentBox {
  [platform: string]: {
    [botId: string]: BotContent
  }
}


export class NextbotBox {
  private nextbots: { [platform: string]: { 
    [botId: string]: Nextbot } } = {}

  constructor(bsc?: BotContentBox) {
    if(bsc) {
      for(const platform in bsc) { // of and in
        for(const botId in bsc[platform]) {
          this.addBot(platform, botId, bsc[platform][botId])
        }
      }
    }
  }


  public addBot(platform: string, botId: string, bc: BotContent): void {
    const newbot = new Nextbot(platform, botId, bc)
    // if a new platform creatnig
    if (!(platform in this.nextbots)) {
      this.nextbots[platform] = {}
    }

    this.nextbots[platform][botId] = newbot
    console.log(`${platform} Nextbot for ${botId} was created`)
  }

  public processInput(platform: string, botId: string, userId: string, 
                      key: string, type: string, params?: object) {
    this.nextbots[platform][botId].processInput(userId, key, type, params)
  }
}
// export { NextbotBox as Box }