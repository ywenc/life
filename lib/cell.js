class Cell {
  constructor() {
    this.dead = true;
    this.posX = undefined;
    this.posY = undefined;
    this.color = "fff";

    this.toggleState = this.toggleState.bind(this);
  }

  toggleState() {
    this.dead = (this.dead === true) ? false : true;
  }
}

export default Cell;
