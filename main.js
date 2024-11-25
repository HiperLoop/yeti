const { create } = require('domain');
const {load_canvas, resize_canvas, resizeCanvas, isHigh, drawGrid} = require('./canvas.js');
const {tryMove} = require('./game.js');
const {createBoard} = require('./game.js');

//website variables
let cnv;

//game variables
let gridSize = 15;
let winLength = 5;

//when window is loaded
window.onload = function() {
    cnv = document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => {tryMove(event, gridSize, [window.innerWidth, window.innerHeight]);});
    load_canvas([window.innerWidth, window.innerHeight], cnv, gridSize);

    createBoard(gridSize);
}

window.onresize = function() {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize);
}