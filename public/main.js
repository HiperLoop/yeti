import { gameLoop, createBoard, gridSize, board } from './game.js';
import { resize_canvas } from './canvas.js';
//website variables
let cnv;
//when window is loaded
window.onload = function () {
    createBoard();
    cnv = document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => { gameLoop(event, [window.innerWidth, window.innerHeight], cnv); });
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
};
window.onresize = function () {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
};
