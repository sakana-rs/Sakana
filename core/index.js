import Decoder from './decode.js'
import Runner from './run.js'

export class Sakana {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.game = null;
  }
  load(file) {
    Runner.run(Decoder(file), this)
  }
}
