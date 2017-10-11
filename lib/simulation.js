import Grid from './grid';

class Simulation {
  constructor(grid) {
    this.paused = true;
    this.grid = grid;
    this.fps = 8;
    //
    this.animate = this.animate.bind(this);
    this.togglePaused = this.togglePaused.bind(this);
    this.start = this.start.bind(this);
    this.clear = this.clear.bind(this);
    this.random = this.random.bind(this);

  }

  animate() {
    if (!this.paused) {
      this.grid.drawMirror();
      this.grid.update();
    }
    setTimeout(() => (requestAnimationFrame(this.animate)), 1000 / this.fps);
  }

  start() {
    this.animate();
  }

  togglePaused(e) {
    if (e.keyCode === 32 || e.type === 'click') {
      e.preventDefault();
      $('#start-button').toggleClass('hidden');
      $('#pause-button').toggleClass('hidden');
      this.paused = !this.paused;
    }
  }

  clear() {
    this.paused = true;

    $('#start-button').removeClass('hidden');
    $('#pause-button').addClass('hidden');

    this.grid.initialize();
    this.grid.drawMirror();
  }

  random() {
    this.clear();
    this.grid.initializeRandom();
  }
}

export default Simulation;
