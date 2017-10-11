import Cell from './cell';
import Sequencer from './sequencer';
const PITCHES = ['C', 'D', 'E', 'G', 'A'];
const OCTAVES = ['1', '2', '3', '4', '5'];

const DELTAS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

class Grid {
  constructor(sequencer) {
    this.cells = {};
    this.notes = {};
    this.sequencer = sequencer;

    let cellWidth = 12;
    this.config = {
      cellWidth: cellWidth,
      canvasWidth: Math.ceil(($(window).width() - 90) / cellWidth) * cellWidth,
      canvasHeight: Math.ceil(($(window).height() - 180) / cellWidth) * cellWidth
    };

    this.config.col = this.config.canvasWidth / cellWidth;
    this.config.row = this.config.canvasHeight / cellWidth;

    this.initialize = this.initialize.bind(this);
    this.draw = this.draw.bind(this);
    this.drawMirror = this.drawMirror.bind(this);
    this.getLiveNeighborCount = this.getLiveNeighborCount.bind(this);
    this.update = this.update.bind(this);
    this.toggleStates = this.toggleStates.bind(this);

    this.initialize();
  }

  initialize() {
    $("#background, #easel, .canvas-container").attr({
      "height": `${this.config.canvasHeight}`,
      "width": `${this.config.canvasWidth}`,
    });

    this.grid = [];
    let pitch = 0;
    let octave = 0;
    for (let col = 0; col < this.config.col; col++) {
      this.grid[col] = [];
      for (let row = 0; row < this.config.row; row++) {
        let cell = new Cell();
        cell.posX = col;
        cell.posY = row;
        cell.width = this.config.cellWidth;
        this.cells[[col, row]] = cell;
        this.grid[col][row] = 0;

        let note = PITCHES[pitch] + OCTAVES[octave];
        console.log(note);
        this.notes[[col, row]] = note;
        pitch++;

        if (pitch == PITCHES.length) {
          pitch = 0;
          octave++;
          if (octave == OCTAVES.length ) { octave = 0; }
        }
      }
    }

    this.draw();
    this.mirrorGrid = JSON.parse(JSON.stringify(this.grid));
  }

  draw() {
    this.background = this.background || new createjs.Stage("background");
    this.background.removeAllChildren();
    let width = this.config.cellWidth;

    Object.keys(this.cells).forEach((key) => {
      let cell = new createjs.Shape();

      cell.graphics.beginStroke("#add8e6");
      cell.graphics.setStrokeStyle(0.5);
      cell.graphics.drawRect(0, 0, width, width);
      cell.x = this.cells[key].posX * width;
      cell.y = this.cells[key].posY * width;

      this.background.addChild(cell);
    });

    this.background.update();
  }

  drawMirror() {
    this.stage = this.stage || new createjs.Stage("easel");
    this.stage.removeAllChildren();
    let width = this.config.cellWidth;
    let sequencer = this.sequencer;

    Object.keys(this.cells).forEach((key) => {
      let cellObj = this.cells[key];
      let cell = new createjs.Shape();

      if (cellObj.dead === false) {
        cell.graphics.beginFill("#ffffff");
        cell.graphics.setStrokeStyle(1);
        cell.graphics.drawRect(0, 0, width - 2, width - 2);
        cell.x = cellObj.posX * width + 1.5;
        cell.y = cellObj.posY * width + 1.5;
        this.stage.addChild(cell);
        cellObj.id = cell.parent.getChildIndex(cell);

        sequencer.synth.triggerAttackRelease(this.notes[key], '4n');
      }
    });

    this.stage.update();
  }

  getLiveNeighborCount(position) {
    let liveNeighborCount = 0;
    let col = position[0];
    let row = position[1];

    DELTAS.forEach((delta) => {
      let colDir = delta[0];
      let rowDir = delta[1];

      if ((col + colDir < 0 ) ||
        (col + colDir >= this.grid.length ) ||
        (row + rowDir < 0) ||
        (row + rowDir >= this.grid[col].length)) {
          return;
      }

      if (this.grid[col + colDir][row + rowDir] === 1) {
        liveNeighborCount += 1;
        if (liveNeighborCount > 3) { return; }
      }
    });
    return liveNeighborCount;
  }

  update() {
    let changedCellsCount = 0;
    Object.keys(this.cells).forEach((key) => {
      let cell = this.cells[key];

      let neighborCount = this.getLiveNeighborCount([cell.posX, cell.posY]);

      if ((neighborCount === 2 || neighborCount === 3) && !cell.dead) {
        this.mirrorGrid[cell.posX][cell.posY] = 1;
        cell.dead = false;

      } else if (neighborCount === 3 && cell.dead) {
        this.mirrorGrid[cell.posX][cell.posY] = 1;
        cell.toggleState();

      } else if ((neighborCount < 2 || neighborCount > 3) && !cell.dead) {
        this.mirrorGrid[cell.posX][cell.posY] = 0;
        cell.toggleState();
      }
    });

    this.grid = JSON.parse(JSON.stringify(this.mirrorGrid));
  }

  toggleStates(row, col) {
    if (this.grid[row][col] === 1) {
      this.grid[row][col] = 0;
      this.cells[[row, col]].dead = true;
    } else {
      this.grid[row][col] = 1;
      this.cells[[row, col]].dead = false;
    }
  }

  initializeRandom() {
    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid[col].length; row++) {
        let bool = Math.random() < 0.6;

        this.grid[col][row] = (bool)? 1 : 0;
        this.cells[[col, row]].dead = bool;
      }
    }

    this.drawMirror();
  }
}

export default Grid;
