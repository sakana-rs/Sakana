import { Sakana } from '../core/index.js'

let emulator = new Sakana('game');

document.getElementById('file').onchange = function(evt){
  emulator.load(evt.target.files[0])
}
