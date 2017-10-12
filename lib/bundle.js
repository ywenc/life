/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _cell = __webpack_require__(1);
	
	var _cell2 = _interopRequireDefault(_cell);
	
	var _grid = __webpack_require__(2);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	var _simulation = __webpack_require__(4);
	
	var _simulation2 = _interopRequireDefault(_simulation);
	
	var _sequencer = __webpack_require__(3);
	
	var _sequencer2 = _interopRequireDefault(_sequencer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	$(function () {
	  var sim = new _simulation2.default(new _grid2.default(new _sequencer2.default()));
	
	  $("#easel").click(function (e) {
	    var cellWidth = sim.grid.config.cellWidth;
	    var easelOffset = $(this).offset();
	    var relX = Math.floor((e.pageX - easelOffset.left) / cellWidth);
	    var relY = Math.floor((e.pageY - easelOffset.top) / cellWidth);
	    var cell = sim.grid.cells[[relX, relY]];
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cell = function () {
	  function Cell() {
	    _classCallCheck(this, Cell);
	
	    this.dead = true;
	    this.posX = undefined;
	    this.posY = undefined;
	    this.color = "fff";
	
	    this.toggleState = this.toggleState.bind(this);
	  }
	
	  _createClass(Cell, [{
	    key: "toggleState",
	    value: function toggleState() {
	      this.dead = this.dead === true ? false : true;
	    }
	  }]);
	
	  return Cell;
	}();
	
	exports.default = Cell;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _cell = __webpack_require__(1);
	
	var _cell2 = _interopRequireDefault(_cell);
	
	var _sequencer = __webpack_require__(3);
	
	var _sequencer2 = _interopRequireDefault(_sequencer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PITCHES = ['C', 'D', 'E', 'G', 'A'];
	var OCTAVES = ['1', '2', '3', '4', '5'];
	
	var DELTAS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
	
	var Grid = function () {
	  function Grid(sequencer) {
	    _classCallCheck(this, Grid);
	
	    this.cells = {};
	    this.notes = {};
	    this.sequencer = sequencer;
	
	    var cellWidth = 12;
	    this.config = {
	      cellWidth: cellWidth,
	      canvasHeight: Math.ceil(($(window).height() - 180) / cellWidth) * cellWidth
	    };
	
	    if ($(window).width() >= 1075) {
	      this.config.canvasWidth = Math.ceil(($(window).width() - 90) / cellWidth) * cellWidth;
	    } else {
	      this.config.canvasWidth = Math.ceil(($(window).width() - 270) / cellWidth) * cellWidth;
	    }
	
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
	
	  _createClass(Grid, [{
	    key: 'initialize',
	    value: function initialize() {
	      $("#background, #easel, .canvas-container").attr({
	        "height": '' + this.config.canvasHeight,
	        "width": '' + this.config.canvasWidth
	      });
	      this.grid = [];
	
	      var pitch = 0;
	      var octave = 0;
	      for (var col = 0; col < this.config.col; col++) {
	        this.grid[col] = [];
	        for (var row = 0; row < this.config.row; row++) {
	          var cell = new _cell2.default();
	          cell.posX = col;
	          cell.posY = row;
	          cell.width = this.config.cellWidth;
	          this.cells[[col, row]] = cell;
	          this.grid[col][row] = 0;
	
	          if ((row + col) % 3 === 0) {
	            var note = PITCHES[pitch] + OCTAVES[octave];
	            this.notes[[col, row]] = note;
	            pitch++;
	
	            if (pitch == PITCHES.length) {
	              pitch = 0;
	              octave++;
	              if (octave == OCTAVES.length) {
	                octave = 0;
	              }
	            }
	          }
	        }
	      }
	
	      this.draw();
	      this.mirrorGrid = JSON.parse(JSON.stringify(this.grid));
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var _this = this;
	
	      this.background = this.background || new createjs.Stage("background");
	      this.background.removeAllChildren();
	      var width = this.config.cellWidth;
	
	      Object.keys(this.cells).forEach(function (key) {
	        var cell = new createjs.Shape();
	
	        cell.graphics.beginStroke("#add8e6");
	        cell.graphics.setStrokeStyle(0.5);
	        cell.graphics.drawRect(0, 0, width, width);
	        cell.x = _this.cells[key].posX * width;
	        cell.y = _this.cells[key].posY * width;
	
	        _this.background.addChild(cell);
	      });
	
	      this.background.update();
	    }
	  }, {
	    key: 'drawMirror',
	    value: function drawMirror() {
	      var _this2 = this;
	
	      this.stage = this.stage || new createjs.Stage("easel");
	      this.stage.removeAllChildren();
	      var width = this.config.cellWidth;
	
	      Object.keys(this.cells).forEach(function (key) {
	        var cellObj = _this2.cells[key];
	        var cell = new createjs.Shape();
	
	        if (cellObj.dead === false) {
	          cell.graphics.beginFill("#ffffff");
	          cell.graphics.setStrokeStyle(1);
	          cell.graphics.drawRect(0, 0, width - 2, width - 2);
	          cell.x = cellObj.posX * width + 1.5;
	          cell.y = cellObj.posY * width + 1.5;
	          _this2.stage.addChild(cell);
	          cellObj.id = cell.parent.getChildIndex(cell);
	        }
	      });
	
	      this.stage.update();
	    }
	  }, {
	    key: 'getLiveNeighborCount',
	    value: function getLiveNeighborCount(position) {
	      var _this3 = this;
	
	      var liveNeighborCount = 0;
	      var col = position[0];
	      var row = position[1];
	
	      DELTAS.forEach(function (delta) {
	        var colDir = delta[0];
	        var rowDir = delta[1];
	
	        if (col + colDir < 0 || col + colDir >= _this3.grid.length || row + rowDir < 0 || row + rowDir >= _this3.grid[col].length) {
	          return;
	        }
	
	        if (_this3.grid[col + colDir][row + rowDir] === 1) {
	          liveNeighborCount += 1;
	          if (liveNeighborCount > 3) {
	            return;
	          }
	        }
	      });
	      return liveNeighborCount;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this4 = this;
	
	      var changedCellsCount = 0;
	      Object.keys(this.cells).forEach(function (key) {
	        var cell = _this4.cells[key];
	
	        var neighborCount = _this4.getLiveNeighborCount([cell.posX, cell.posY]);
	
	        if ((neighborCount === 2 || neighborCount === 3) && !cell.dead) {
	          _this4.mirrorGrid[cell.posX][cell.posY] = 1;
	          cell.dead = false;
	        } else if (neighborCount === 3 && cell.dead) {
	          _this4.mirrorGrid[cell.posX][cell.posY] = 1;
	          cell.toggleState();
	        } else if ((neighborCount < 2 || neighborCount > 3) && !cell.dead) {
	          _this4.mirrorGrid[cell.posX][cell.posY] = 0;
	          cell.toggleState();
	        }
	
	        if (!cell.dead && _this4.notes[key]) {
	          _this4.sequencer.synth.triggerAttackRelease(_this4.notes[key], '4n');
	        }
	      });
	
	      this.grid = JSON.parse(JSON.stringify(this.mirrorGrid));
	    }
	  }, {
	    key: 'toggleStates',
	    value: function toggleStates(row, col) {
	      if (this.grid[row][col] === 1) {
	        this.grid[row][col] = 0;
	        this.cells[[row, col]].dead = true;
	      } else {
	        this.grid[row][col] = 1;
	        this.cells[[row, col]].dead = false;
	      }
	    }
	  }, {
	    key: 'initializeRandom',
	    value: function initializeRandom() {
	      for (var col = 0; col < this.grid.length; col++) {
	        for (var row = 0; row < this.grid[col].length; row++) {
	          var bool = Math.random() < 0.6;
	
	          this.grid[col][row] = bool ? 1 : 0;
	          this.cells[[col, row]].dead = bool;
	        }
	      }
	
	      this.drawMirror();
	    }
	  }]);
	
	  return Grid;
	}();
	
	exports.default = Grid;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Sequencer = function () {
	  function Sequencer() {
	    _classCallCheck(this, Sequencer);
	
	    // this.monoSynth = new Tone.Mono(11, Tone.DuoSynth).toMaster();
	    // this.monoSynth = new Tone.MonoSynth(11, Tone.DuoSynth);
	    // this.metalSynth = new Tone.MetalSynth(11, Tone.DuoSynth);
	    this.synth = new Tone.PolySynth(11, Tone.DuoSynth).toMaster();
	    Tone.Master.mute = true;
	  }
	
	  _createClass(Sequencer, [{
	    key: 'start',
	    value: function start() {
	      Tone.Transport.start();
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      Tone.Transport.stop();
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {}
	  }, {
	    key: 'toggleMute',
	    value: function toggleMute(e) {
	      Tone.Master.mute = Tone.Master.mute === true ? false : true;
	      e.preventDefault();
	      $('#volume-button').toggleClass('hidden');
	      $('#stop-sound').toggleClass('hidden');
	    }
	  }]);
	
	  return Sequencer;
	}();
	
	module.exports = Sequencer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _grid = __webpack_require__(2);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Simulation = function () {
	  function Simulation(grid) {
	    _classCallCheck(this, Simulation);
	
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
	
	  _createClass(Simulation, [{
	    key: 'animate',
	    value: function animate() {
	      var _this = this;
	
	      if (!this.paused) {
	        this.grid.drawMirror();
	        this.grid.update();
	      }
	      setTimeout(function () {
	        return requestAnimationFrame(_this.animate);
	      }, 1000 / this.fps);
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      this.animate();
	    }
	  }, {
	    key: 'togglePaused',
	    value: function togglePaused(e) {
	      if (e.keyCode === 32 || e.type === 'click') {
	        e.preventDefault();
	        $('#start-button').toggleClass('hidden');
	        $('#pause-button').toggleClass('hidden');
	        this.paused = !this.paused;
	      }
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.paused = true;
	
	      $('#start-button').removeClass('hidden');
	      $('#pause-button').addClass('hidden');
	
	      this.grid.initialize();
	      this.grid.drawMirror();
	    }
	  }, {
	    key: 'random',
	    value: function random() {
	      this.clear();
	      this.grid.initializeRandom();
	    }
	  }]);
	
	  return Simulation;
	}();
	
	exports.default = Simulation;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map