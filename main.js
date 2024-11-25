const { create } = require('domain');
const {resize_canvas} = require('./canvas.js');
const {gameLoop} = require('./game.js');
const {gridSize, createBoard} = require('./game.js');

//website variables
let cnv;

//when window is loaded
window.onload = function() {
    cnv = document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => {gameLoop(event, [window.innerWidth, window.innerHeight], cnv);});
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize);

    createBoard();
}

window.onresize = function() {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize);
}