import { STATEDIV } from '../config'

class State {
  public group: string
  public index: number

  constructor(sGroup: string, sIndex?: number) {
    this.group = sGroup
    if (sIndex) this.index = sIndex
  }

  public toString(): string {
    let res = this.group
    if (this.index !== undefined) res += STATEDIV + this.index
    return res
  }

  public is(state: State | string): boolean {
    if (typeof state === 'string') {
      return (this.group === state && this.index === undefined)
    } else if (state instanceof State) {
      return (this.group === state.group && this.index === state.index)
    }
  }

  public first(newGroup: string): void { 
    this.index = 0; this.group = newGroup }

  public next(): void { this.index++ }
}

export default State