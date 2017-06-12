/////////////////////////////////////////////////
// FSM State for bot instance
const DIV: string = '__'

export class State {
  public group: string
  public index: number | undefined
  // How to depricate change here?
  public prevState: State 
  
  // stateIndex only if the first param type is not State
  constructor(stateOrGroup: (string | State), stateIndex?: number) {
    if (typeof stateOrGroup === 'string') {
      this.group = stateOrGroup
      this.index = stateIndex
    } else {
      this.group = stateOrGroup.group
      this.index = stateOrGroup.index
    }
  }

  public toString = (): string => {
    let res = (this.index) 
      ? `${this.group}${DIV}${this.index}`
      : this.group
    return res
  }

  public change(sgroup: string, sindex?: number): void {
    // saving currentState to prevState
    this.prevState = new State(this.group, this.index)
    this.group = sgroup
    this.index = sindex
  }

  public is(state: State): boolean { 
    return (state.group === this.group && state.index === this.index)
  }
}

export const START: State = new State('_start')
export const IDLE: State = new State('_idle')
export const DEFAULT: State = new State('_default')

// let s: State = new State('ololo', 2)
// s.change('test', 1)
// console.log(''+s)
// console.log(''+s.prevState)