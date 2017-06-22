import State from '../../src/nextbot/state'
import { IDLE, STATEDIV } from '../../src/config'

///////////////////////////////////////////////////
///////////////////// class State /////////////////
describe('class State', () => {
  let s = new State(IDLE)
  let s2 = new State('test', 3)
  let s3 = new State('idle')
  
  test('constructor', () => {
    expect(s.group).toBe(IDLE)
    expect(s.index).toBe(undefined)
    expect(s2.group).toBe('test')
    expect(s2.index).toBe(3)
  })

  test('is', () => {
    expect(s.is(s3)).toBe(true)
    expect(s.is(IDLE)).toBe(true)
  })
  
  test('toString', () => {
    expect(s.toString()).toBe(IDLE)
    expect(s2.toString()).toBe('test'+STATEDIV+3)
  })
})