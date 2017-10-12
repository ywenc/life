import Cell from './cell';
import Grid from './grid';
import Simulation from './simulation';
import Sequencer from './sequencer';

$(() => {
  const sim = new Simulation(new Grid(new Sequencer()));

  $("#easel").click(function(e) {
    let cellWidth = sim.grid.config.cellWidth;
    let easelOffset = $(this).offset();
    let relX = Math.floor(((e.pageX - easelOffset.left) / cellWidth));
    let relY = Math.floor(((e.pageY - easelOffset.top) / cellWidth));
    let cell = sim.grid.cells[[relX, relY]];
    //
    cell.toggleState();
    sim.grid.toggleStates(relX, relY);
    sim.grid.drawMirror();
  });

  $('#start-button').on('click', sim.togglePaused);
  $('#pause-button').on('click', sim.togglePaused);
  $('#reset-button').on('click', sim.clear);
  $('#volume-button').on('click', sim.grid.sequencer.toggleMute);
  $('#stop-sound').on('click', sim.grid.sequencer.toggleMute);

  $('#random-preset').on('click', sim.random);

  sim.start();
});
