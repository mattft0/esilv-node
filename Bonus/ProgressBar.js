// index.js
const process = require("node:process");
const rdl = require("node:readline");

class ProgressBar {
  constructor(size, maxCount) {
    this.size = size;
    this.maxCount = maxCount;
    this.step = maxCount / size;
    this.readLine = rdl.createInterface(process.stdin, process.stdout);
  }

  start() {
    this.readLine.on("line", (lineno, _) => {
      this.currentLine = lineno;
    });
    this.readLine.write("\x1B[?25l");
    this.readLine.write("[");
    for (let i = 0; i < this.size; i++) {
      this.readLine.write(" ");
    }
    this.readLine.write("]");
    this.cursor = 1;
    const { rows, cols } = this.readLine.getCursorPos();
    rdl.cursorTo(process.stdout, this.cursor);
    this.readLine.write("=");
  }
  setValue(value) {
    if (value > this.cursor * this.step) {
      this.cursor++;
      this.readLine.write("=");
    }
  }
}

module.exports = ProgressBar;
