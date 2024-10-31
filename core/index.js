import Decoder from './decode.js'
import Runner from './run.js'

export class Sakana {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.game = null;
  }
  load(file) {
    let runner = new Runner(this);
    this.game = runner;
    runner.run(Decoder(file))
  }
}
