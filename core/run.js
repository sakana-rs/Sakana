export class Runner {
  constructor(Sakana) {
    this.Sakana = Sakana;
    // Game properties
    this.framerate = 30; // FPS
    this.paused = false;
    this.loading = true;
  }
  drawTextScreen(text) {
    // Blank out the screen
    this.Sakana.ctx.fillStyle = 'black';
    this.Sakana.ctx.fillRect(0, 0, this.Sakana.width, this.Sakana.height);
    // Write text
    this.Sakana.ctx.fillStyle = 'white';
    this.Sakana.ctx.font = '48px Arial';
    this.Sakana.ctx.textAlign = 'center';
    this.Sakana.ctx.textBaseline = 'middle';
    this.Sakana.ctx.fillText(text, this.Sakana.width / 2, this.Sakana.height / 2);
  }
  run(code) {
    const mspf = 1000 / this.framerate; // Convert from FPS to MsPF (Miliseconds per Frame)
    const _this = this;
    setInterval(function(){
      if (_this.loading) {
        _this.drawTextScreen('Sakana\nLoading...');
      } else if (this.paused) {
        _this.drawTextScreen('Sakana\nPaused');
      } else {
        // game
      }
    }, mspf)
  }
}
