const {isHigh, maxSize, drawMove} = require('./canvas.js');
const {compressBoard} = require('./compression.js');

const board = [];

function createBoard(gridSize) {
    for(let i = 0; i < gridSize; ++i) {
        board[i] = [];
        for(let j = 0; j < gridSize; ++j) {
            board[i][j] = 0;
        }
    }
}

function getCoordsFromEvent(event, gridSize, windowSize) {
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

function tryMove(event, gridSize, windowSize) {
    const coords = getCoordsFromEvent(event, gridSize, windowSize);
    console.log(coords);
    if(board[coords[0]][coords[1]] == 0) {
        board[coords[0]][coords[1]] = 1;
        drawMove(coords[0], coords[1], 1, gridSize);
        console.log("compressed: " + compressBoard(board))
    }
}

function makeMove(event) {
    if(board[xCoord * gridSize+yCoord] == 0 && !gameOver) {
        makePlayerMove(xCoord, yCoord, -1);
        console.log("number of possible moves: " + possibleMoves.size)
        checkGameEnd(xCoord, yCoord);

        if(!gameOver) {
            makeBotMove(1);
            checkGameEnd(botX, botY);
        }
    }
    else if(gameOver) {
        resetGame();
        if(botFirst) {
            possibleMoves.add(Math.floor(gridSize/2)*gridSize + Math.floor(gridSize/2));
            crossToMove = true;
            makeBotMove(1);
        }
    }

    console.log("current position eval:" + positionEval(true));
}

module.exports = {tryMove, createBoard};