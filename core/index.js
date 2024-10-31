import Decoder from './decode.js'
import Runner from './run.js'

export class Sakana {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.canvas.width = 1280;
    this.canvas.width = 720;
    this.game = null;
  }
  load(file) {
    let runner = new Runner(this);
    this.game = runner;
    runner.run(Decoder(file))
  }
}
