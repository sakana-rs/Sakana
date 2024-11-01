import { Sakana } from '../core/index.js'

let emulator = new Sakana('game');
window.emulator = emulator;

document.getElementById('run').onclick = function(){
  emulator.load(document.getElementById('file').files[0], document.getElementById('keys').files[0])
}

document.getElementById('b-p').onclick = function(){
  emulator.game.pause()
}
document.getElementById('b-r').onclick = function(){
  emulator.game.resume()
}
document.getElementById('b-f').onclick = function(){
  emulator.game.fullscreen()
}
