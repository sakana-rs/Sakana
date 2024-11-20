import { Runner } from './run.js'

export class Sakana {
  constructor(id) {
    console.log('[Sakana] Starting Sakana')
    this.root = document.getElementById(id);
    // Game canvas
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    this._width = 1280;
    this._height = 720;
    canvas.width = 1280;
    canvas.height = 720;
    this.root.appendChild(canvas);

    this.ctx = canvas.getContext('2d');
    this.game = null;
  }
  get width() {
    return this._width;
  }
  set width(number) {
    number = Number(number);
    this._width = number;
    this.canvas.width = number;
  }
  get height() {
    return this._height;
  }
  set height(number) {
    number = Number(number);
    this._height = number;
    this.canvas.height = number;
  }
  load(file, keys) {
    let runner = this.game ?? new Runner(this);
    this.game = runner;
    runner.run(file, keys)
  }
}