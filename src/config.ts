export let START = 'start'
export let IDLE = 'idle'
export let DEFAULT = '_default'
export let STATEDIV = '_'

export let CUSTOM = '_custom'

export let BOTWAIT_DEFAULT = {
  wait_before: 0, typing_on: false, wait_input: 'auto' }
export let BOTWAIT_INPUTAUTO = { 
  text: false, image: false, buttons: true, tbuttons: true, empty: true }

export let MESTYPES = {
  text: 'txt',
  tbuttons: 'tbtn',
  buttons: 'btn',
  image: 'img'
}

export let log = {
  inline: function(str) {
    process.stdout.write(str)
  }
}