import { Sakana } from '../core/index.js'

let emulator = new Sakana('game');

document.getElementById('file').onchange = function(evt){
  emulator.load(evt.target.files[0])
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
