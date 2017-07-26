export let START = 'start'
export let IDLE = 'idle'
export let DEFAULT = '_default'
export let STATEDIV = '_'

export let CUSTOM = '_custom'

export let BOTWAIT_DEFAULT = {
  wait_before: 0, typing_on: false, wait_input: 'auto' }
export let BOTWAIT_INPUTAUTO = { 
  text: false, image: false, buttons: true, tbuttons: true, generic: false, empty: true, other: false }

export let MESTYPES = {
  text: 'txt',
  tbuttons: 'tbtn',
  buttons: 'btn',
  image: 'img',
  generic: 'generic'
}

export let log = {
  inline: function(str) {
    process.stdout.write(str)
  }
}

export class Logger {
  private readonly isDebug: boolean

  constructor(isDebug: boolean) {
    this.isDebug = isDebug
  }

  debug(str) {
    if (this.isDebug) console.log(str)
  }

  inline(str) {
    if (this.isDebug) process.stdout.write(str)
  }
}