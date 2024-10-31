import Decode from './decode.js'
import Runner from './run.js'

export class Sakana {
  constructor(id) {
    // Game canvas
    const canvas = document.getElementById(id);
    this.canvas = canvas;
    this.width = 1280;
    this.height = 720;
    canvas.width = 1280;
    canvas.height = 720;

    this.ctx = canvas.getContext('2d');
    this.game = null;
  }
  load(file) {
    let runner = new Runner(this);
    this.game = runner;
    runner.run(Decode(file))
  }
}
