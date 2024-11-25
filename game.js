const {isHigh, maxSize, drawMove, drawGrid, drawWin} = require('./canvas.js');
const {compressBoard} = require('./compression.js');
//const {makeBotMove} = require('./alfabeta.js');

const board = [];
let moveCounter = 0;
const gridSize = 15;
const winLength = 5;
let gameOver = false;
let botFirst = false;
const bot = -1;
const human = 1;
let humanVhuman = false;

function createBoard() {
    for(let i = 0; i < gridSize; ++i) {
        board[i] = [];
        for(let j = 0; j < gridSize; ++j) {
            board[i][j] = 0;
        }
    }
}

function resetGame(windowSize, canvas) {
    moveCounter = 0;
    botFirst = !botFirst;
    gameOver = false;
    createBoard();
    drawGrid(gridSize, windowSize, canvas);
}

function checkWin(x, y) {
    let chain = new Array(2);
    const player = board[x][y];
    chain = [[], [], [player]];
    let chainLength = 0;
    let newChain = true;

    //horizontal
    for(let i = Math.max(y-(winLength-1), 0); i <= Math.min(y+(winLength-1), (gridSize-1)); ++i){
        if(board[x][i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [x, i];
                newChain = false;
            }
            else {chain[1] = [x, i];}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {return chain;}
    }
    //vertical
    chainLength = 0;
    newChain = true;
    for(let i = Math.max(x-(winLength-1), 0); i <= Math.min(x+(winLength-1), (gridSize-1)); ++i){
        if(board[i][y] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [i, y];
                newChain = false;
            }
            else {chain[1] = [i, y];}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {return chain;}
    }
    //diagonal
    chainLength = 0;
    newChain = true;
    let bottomOffset = Math.min(x-Math.max(x-(winLength-1), 0),y-Math.max(y-(winLength-1), 0));
    let topOffset = Math.min(Math.min(x+(winLength-1), (gridSize-1))-x, Math.min(y+(winLength-1), (gridSize-1))-y);
    for(let i = -bottomOffset; i <= topOffset; ++i){
        if(board[x+i][y+i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [x+i, y+i];
                newChain = false;
            }
            else {chain[1] = [x+i, y+i];}
        }
        else{chainLength = 0; newChain = true}
        if(chainLength == winLength) {return chain;}
    }

    chainLength = 0;
    newChain = true;
    bottomOffset = Math.min(Math.min(x+(winLength-1), (gridSize-1))-x,y-Math.max(y-(winLength-1), 0));
    topOffset = Math.min(x-Math.max(x-(winLength-1), 0), Math.min(y+(winLength-1), (gridSize-1))-y);
    for(let i = -bottomOffset; i <= topOffset; ++i){
        if(board[x-i][y+i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [x-i, y+i];
                newChain = false;
            }
            else {chain[1] = [x-i, y+i];}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {return chain;}
    }
    return [[0], [0], [0]];
}

function checkGameEnd(x, y) {
    const won = checkWin(x, y);
    if(won[2] != 0) {
        gameOver = true;
        console.log(won + " won")
        drawWin(won[0], won[1], gridSize);
    }
    if(moveCounter >= gridSize * gridSize) {gameOver = true;}
}

function getCoordsFromEvent(event, windowSize) {
    const xPos = event.clientX;
    const yPos = event.clientY;
    const mSize = maxSize(windowSize);
    const width = windowSize[0];
    const height = windowSize[1];
    var yCoord = Math.floor((xPos-((width-mSize)/2))/(mSize/gridSize));
    var xCoord = Math.floor((yPos-5)/(mSize/gridSize));
    if(isHigh(windowSize)) {
        yCoord = Math.floor((xPos-5)/(mSize/gridSize));
        xCoord = Math.floor((yPos-((height-mSize)/2))/(mSize/gridSize));
    }

    return [xCoord, yCoord];
}

function makePlayerMove(x, y, player) {
    board[x][y] = player;
    drawMove(x, y, player, gridSize);
    ++moveCounter;
}

function tryMove(event, windowSize) {
    const coords = getCoordsFromEvent(event, windowSize);
    console.log(coords);
    if(board[coords[0]][coords[1]] == 0) {
        console.log(botFirst);
        makePlayerMove(coords[0], coords[1], humanVhuman ? (botFirst ? (moveCounter % 2 == 0 ? bot : human) : (moveCounter % 2 == 0 ? human : bot)) : human, gridSize);
        checkGameEnd(coords[0], coords[1]);
    }
}

function gameLoop(event, windowSize, canvas) {
    if(!gameOver) {
        tryMove(event, windowSize);

        /*const botMove = makeBotMove();
        makePlayerMove(botMove[0], botMove[1], bot);
        checkGameEnd(botMove[0], botMove[1]);*/
    }
    else{
        resetGame(windowSize, canvas);

        if(botFirst) {
            /*const botMove = makeBotMove();
            makePlayerMove(botMove[0], botMove[1], bot);
            checkGameEnd(botMove[0], botMove[1]);*/
        }
    }
}

module.exports = {gridSize, tryMove, createBoard, gameLoop};