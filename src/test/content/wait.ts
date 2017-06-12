import { BotWait } from "../../index"

const botWait: BotWait = {

  _default: { wait_before: 5000, typing_on: false, wait_input: 'auto' },
  
  greeting: { wait_before: 100, wait_input: 'no' },
  buttonas: { wait_input: 'any' }, // auto | tbutton | button | textinput | any | no, 
  result1: { wait_before: 0, wait_input: 'no' },
  result2: { wait_input: 'no' }

}
export default botWait