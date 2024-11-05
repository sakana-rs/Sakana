import { Decode } from './decode.js'

export class Runner {
  constructor(Sakana) {
    this.Sakana = Sakana;
    // Game properties
    this.framerate = 30; // FPS
    this.data = {};
    this.paused = false;
    this.loading = true;
    // Logo
    let logo = new Image();
    this._logo = logo;
    logo.src = "./core/Sakana.svg";
  }
  _drawTextScreen(text) {
    // Blank out the screen
    this.Sakana.ctx.fillStyle = 'black';
    this.Sakana.ctx.fillRect(0, 0, this.Sakana.width, this.Sakana.height);
    // Write name
    this.Sakana.ctx.fillStyle = 'white';
    this.Sakana.ctx.font = '48px Arial';
    this.Sakana.ctx.textAlign = 'center';
    this.Sakana.ctx.textBaseline = 'middle';
    this.Sakana.ctx.fillText('Sakana', this.Sakana.width / 2 + 20, this.Sakana.height / 2 - 20);
    this.Sakana.ctx.save();
    this.Sakana.ctx.translate(this.Sakana.width / 2 - 90, this.Sakana.height / 2 - 25);
    this.Sakana.ctx.rotate((Date.now()/5)%360 * Math.PI / 180);
    this.Sakana.ctx.drawImage(this._logo, -this._logo.width/2, -this._logo.height/2, 50, 50);
    this.Sakana.ctx.restore(); 
    // Write text
    this.Sakana.ctx.fillStyle = 'white';
    this.Sakana.ctx.font = '24px Arial';
    this.Sakana.ctx.textAlign = 'center';
    this.Sakana.ctx.textBaseline = 'middle';
    this.Sakana.ctx.fillText(text, this.Sakana.width / 2, this.Sakana.height / 2 + 20);
  }
  run(file, keys) {
    console.log('[Sakana] Loading file: '+file.name)
    const mspf = 1000 / this.framerate; // Convert from FPS to MsPF (Miliseconds per Frame)
    const _this = this;
    setInterval(function(){
      if (_this.loading) {
        _this._drawTextScreen('Loading.' + '.'.repeat(Math.floor(Date.now() / 1000) % 3));
      } else if (_this.paused) {
        _this._drawTextScreen('Paused');
      } else {
        // Temp screen paint
        _this.Sakana.ctx.fillStyle = '#'+Math.floor(Math.random()*120);
        _this.Sakana.ctx.fillRect(0, 0, _this.Sakana.width, _this.Sakana.height);
      }
    }, mspf)

    // Decode file
    Decode(file, keys)
      .then(data => {
        this.data = data;
        this.loading = false;
      })
      .catch(err => {
        console.error('[Sakana] Error while decoding, error: '+err)
      })
  }
  pause() { this.paused = true }
  resume() { this.paused = false }
  fullscreen() { this.Sakana.root.requestFullscreen() }
}