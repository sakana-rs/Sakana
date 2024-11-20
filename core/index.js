import { Runner } from './run.js'

export class Sakana {
  constructor(id) {
    console.log('[Sakana] Starting Sakana')
    this.root = document.getElementById(id);
    // Game canvas
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    this.width = 1280;
    this.height = 720;
    canvas.width = 1280;
    canvas.height = 720;
    this.root.appendChild(canvas);

    this.ctx = canvas.getContext('2d');
    this.game = null;
  }
  set width(number) {
    number = Number(number);
    this.width = number;
    this.canvas.width = number;
  }
  set height(number) {
    number = Number(number);
    this.height = number;
    this.canvas.height = number;
  }
  load(file, keys) {
    let runner = this.game ?? new Runner(this);
    this.game = runner;
    runner.run(file, keys)
  }
}