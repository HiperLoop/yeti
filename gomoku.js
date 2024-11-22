let cnv;
let maxSize = 0;
let isHigh = true;
let gridSize = 15;
let winLength = 5;
const board = new Array(gridSize * gridSize);
let possibleMoves = new Set();
let previousPossibleMoves = new Set();
let crossToMove = true;
let gameOver = false;
let moveCounter = 0;
let depthModifier = 0;

let botX = 0;
let botY = 0;
let won = 0;

let botFirst = false;
let botWentlast = false;

let bestMovePercent = 100;

window.onload = function() {
    cnv = document.getElementById("myCanvas");
    cnv.style.background = "#FFFFFF";

    createBoard();
    resizeCanvas();
    drawGrid();
}

window.onresize = function() {
    resizeCanvas();
    drawGrid();
}

function getFactorial(number) {
    let result = 1;
    if(number >= 0) {
        for(let i = 1; i <= number; ++i) {
            result *= i;
        }
        return result;
    }
    return 0;
}

function autoBotDiff() {
    let compCount = 1;
    let ittCount = 0;
    for(let i = (gridSize * gridSize) - moveCounter; i > 0; --i) {
        compCount *= i;
        ++ittCount;
        if(compCount > 1000000000) {
            console.log(compCount / i);
            return ittCount - 1;
        }
    }
    //console.log("count ended");
    for(;getFactorial(ittCount) > 100000000;){
        --ittCount;
    }
    return ittCount;
}

function createBoard() {
    for(let i = 0; i < gridSize * gridSize; ++i) {
        board[i] = 0;
    }
}

function resizeCanvas() {
    maxSize = window.innerWidth - 10;
    isHigh = true;
    if(window.innerWidth > window.innerHeight) {
        maxSize = window.innerHeight - 10;
        isHigh = false;
    }
    cnv.width = maxSize;
    cnv.height = maxSize;
}

function drawGrid() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, maxSize, maxSize);

    
    for(let i = 0; i < gridSize; ++i) {
        var rectSize = c.height/gridSize;
        var start = 0.5 * rectSize;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(start-1 + i*rectSize, start-1);
        ctx.lineTo(start-1 + i*rectSize, c.height - start);
        ctx.moveTo(start-1, start-1 + i*rectSize);
        ctx.lineTo(c.height - start, start-1 + i*rectSize);
        ctx.stroke();
        ctx.closePath();
    }
}

function checkWin(x, y, player, returnChain) {
    let chain = new Array(2);
    chain = [0, 0];
    let chainLength = 0;
    let newChain = true;

    //vertical
    for(let i = Math.max(y-(winLength-1), 0); i <= Math.min(y+(winLength-1), (gridSize-1)); ++i){
        if(board[x * gridSize+i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = x * gridSize+i;
                newChain = false;
            }
            else {chain[1] = x * gridSize+i;}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {
            if(!returnChain) {return player;}
            else {return chain;}
        }
    }
    //horizontal
    chainLength = 0;
    newChain = true;
    for(let i = Math.max(x-(winLength-1), 0); i <= Math.min(x+(winLength-1), (gridSize-1)); ++i){
        if(board[i * gridSize+y] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = i * gridSize+y;
                newChain = false;
            }
            else {chain[1] = i * gridSize+y;}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {
            if(!returnChain) {return player;}
            else {return chain;}
        }
    }
    //diagonal
    chainLength = 0;
    newChain = true;
    let bottomOffset = Math.min(x-Math.max(x-(winLength-1), 0),y-Math.max(y-(winLength-1), 0));
    let topOffset = Math.min(Math.min(x+(winLength-1), (gridSize-1))-x, Math.min(y+(winLength-1), (gridSize-1))-y);
    for(let i = -bottomOffset; i <= topOffset; ++i){
        if(board[(x+i) * gridSize+y+i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = (x+i) * gridSize+y+i;
                newChain = false;
            }
            else {chain[1] = (x+i) * gridSize+y+i;}
        }
        else{chainLength = 0; newChain = true}
        if(chainLength == winLength) {
            if(!returnChain) {return player;}
            else {return chain;}
        }
    }

    chainLength = 0;
    newChain = true;
    bottomOffset = Math.min(Math.min(x+(winLength-1), (gridSize-1))-x,y-Math.max(y-(winLength-1), 0));
    topOffset = Math.min(x-Math.max(x-(winLength-1), 0), Math.min(y+(winLength-1), (gridSize-1))-y);
    for(let i = -bottomOffset; i <= topOffset; ++i){
        if(board[(x-i) * gridSize+y+i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = (x-i) * gridSize+y+i;
                newChain = false;
            }
            else {chain[1] = (x-i) * gridSize+y+i;}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {
            if(!returnChain) {return player;}
            else {return chain;}
        }
    }
    return 0;
}

function ammendPossibleMoves(x, y) {
    for(let i = 0; i < 81; ++i) {
        let targetX = x + Math.floor(i/9) - 4;
        let targetY = y + Math.floor(i%9) - 4;

        if(targetX < gridSize && targetX >= 0 && targetY < gridSize && targetY >= 0) {
            if(board[targetX * gridSize + targetY] == 0) {
                possibleMoves.add(targetX * gridSize + targetY);
            }
        }
    }
}

function drawMove(i, j, player) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    var rectSize = c.height/gridSize;
    board[i * gridSize+j] = player;
    if(player == 1) {
        ctx.fillStyle = "#000000";
        ctx.moveTo(i * rectSize + (rectSize/4 * 3), j * rectSize + (rectSize/2));
        ctx.arc(i * rectSize + (rectSize/2), j * rectSize + (rectSize/2), rectSize/4, 0, 2 * Math.PI);
        ctx.fill();
    }
    else if(player == -1) {
        ctx.fillStyle = "#ffffff";
        ctx.moveTo(i * rectSize + (rectSize/4 * 3), j * rectSize + (rectSize/2));
        ctx.arc(i * rectSize + (rectSize/2), j * rectSize + (rectSize/2), rectSize/4, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.stroke();
}

function drawWin(start, end) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var rectSize = c.height/gridSize;

    ctx.beginPath();
    var xStart = Math.floor(start/gridSize);
    var yStart = start%gridSize;
    var xEnd = Math.floor(end/gridSize);
    var yEnd = end%gridSize;
    ctx.moveTo(xStart*rectSize + rectSize/2, yStart*rectSize + rectSize/2);
    ctx.lineTo(xEnd*rectSize + rectSize/2, yEnd*rectSize + rectSize/2);
    ctx.lineWidth = 10;
    ctx.stroke();
}

function overText(player) {
    var i = "X";
    if(player == -1) {player = 2; i = "O"}
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, maxSize, maxSize);
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillText("Won player " + player + " (" + i + ")", maxSize/2, maxSize/2);
}

function makeBotMove(player) {
    let localDiff = 2;
    let botMove = minimax(player, 0, localDiff, -1000000, 1000000, 0, 0);
    console.log(localDiff);
    botX = Math.floor(botMove/gridSize)
    botY = botMove%gridSize;
    drawMove(botX, botY, player);
    ammendPossibleMoves(botX, botY);
    if(player == 1) {crossToMove = false;}
    else {crossToMove = true;}
    ++moveCounter;
    botWentlast = true;
    won = checkWin(botX, botY, player, false);
}

function makePlayerMove(x, y, player) {
    drawMove(x, y, player);
    ammendPossibleMoves(x, y);
    if(player == 1) {crossToMove = false;}
    else {crossToMove = true;}
    ++moveCounter;
    botWentlast = false;
    won = checkWin(x, y, player, false);
}

function resetGame() {
    won = 0;
    botFirst = !botFirst;
    moveCounter = 0;
    gameOver = false;
    possibleMoves.clear();
    createBoard();
    resizeCanvas();
    drawGrid();
}

function checkGameEnd(x, y) {
    if(won != 0) {
        console.log(won + " won")
        gameOver = true;
        let winLine = new Array(2);
        const checkStart = performance.now();
        winLine = checkWin(x, y, board[x * gridSize + y], true);
        const checkEnd = performance.now();
        const checkDiff = checkEnd - checkStart;
        console.log("Check win time = " + checkDiff);
        drawWin(winLine[0], winLine[1]);
    }
    else if(moveCounter >= gridSize * gridSize) {gameOver = true;}
}

function makeMove(event) {
    console.log("number of possible moves: " + possibleMoves.size)
    var xPos = event.clientX;
    var yPos = event.clientY;
    var xCoord = Math.floor((xPos-((window.innerWidth-maxSize)/2))/(maxSize/gridSize));
    var yCoord = Math.floor((yPos-5)/(maxSize/gridSize));
    if(isHigh) {
        xCoord = Math.floor((xPos-5)/(maxSize/gridSize));
        yCoord = Math.floor((yPos-((window.innerHeight-maxSize)/2))/(maxSize/gridSize));
    }

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

function positionEval(check=false) {
    let eval = 0;
    let currentLength = 0;
    let previousPlayer = -2;
    let currentPlayer = 0;
    let add = 0;
    let fullBoard = true;
    //horizontal
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            currentPlayer = board[i * gridSize+j];
            if(currentPlayer != 0) {
                if(previousPlayer == currentPlayer) {
                    ++currentLength;
                }
                else if(currentPlayer == previousPlayer * -1) {
                    eval += previousPlayer * ((currentLength * currentLength)+(add*2));
                    //if(check) {console.log("added: " + (previousPlayer * ((currentLength * currentLength)+(add*2))) + ", the new total is: " + eval)}
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; eval += previousPlayer * ((currentLength * currentLength)+(add*2)); fullBoard = false;
                //if(check) {console.log("added: " + (previousPlayer * ((currentLength * currentLength)+(add*2))) + ", the new total is: " + eval)}
                add = 0;
            }
            if(currentLength >= winLength) {return 10000 * previousPlayer;}
            previousPlayer = currentPlayer;
        }
        add = 0;
        previousPlayer = -2;
        currentLength = 0;
    }
    //vertical
    currentLength = 0;
    previousPlayer = -2;
    currentPlayer = 0;
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            currentPlayer = board[j * gridSize+i];
            if(currentPlayer != 0) {
                if(previousPlayer == currentPlayer) {
                    ++currentLength;
                }
                else if(currentPlayer == previousPlayer * -1) {
                    eval += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; eval += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
            if(currentLength >= winLength) {return 10000 * previousPlayer;}
            previousPlayer = currentPlayer;
        }
        add = 0;
        previousPlayer = -2;
        currentLength = 0;
    }
    //right down
    currentLength = 0;
    previousPlayer = -2;
    currentPlayer = 0;
    for(let j = gridSize - winLength; j >= 0; --j) {
        for(let i = 0; j+i < gridSize; ++i) {
            currentPlayer = board[i * gridSize + j+i];
            if(currentPlayer != 0) {
                if(previousPlayer == currentPlayer) {
                    ++currentLength;
                }
                else if(currentPlayer == previousPlayer * -1) {
                    eval += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; eval += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
            if(currentLength >= winLength) {return 10000 * previousPlayer;}
            previousPlayer = currentPlayer;
        }
        add = 0;
        previousPlayer = -2;
        currentLength = 0;
    }
    currentLength = 0;
    previousPlayer = -2;
    currentPlayer = 0;
    for(let j = gridSize - winLength; j > 0; --j) {
        for(let i = 0; j+i < gridSize; ++i) {
            currentPlayer = board[(j+i) * gridSize + i];
            if(currentPlayer != 0) {
                if(previousPlayer == currentPlayer) {
                    ++currentLength;
                }
                else if(currentPlayer == previousPlayer * -1) {
                    eval += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; eval += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
            if(currentLength >= winLength) {return 10000 * previousPlayer;}
            previousPlayer = currentPlayer;
        }
        add = 0;
        previousPlayer = -2;
        currentLength = 0;
    }
    //left down
    currentLength = 0;
    previousPlayer = -2;
    currentPlayer = 0;
    for(let j = gridSize - winLength; j > 0; --j) {
        for(let i = 0; j+i < gridSize; ++i) {
            currentPlayer = board[(gridSize-1-i) * gridSize + j+i];
            if(currentPlayer != 0) {
                if(previousPlayer == currentPlayer) {
                    ++currentLength;
                }
                else if(currentPlayer == previousPlayer * -1) {
                    eval += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; eval += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
            if(currentLength >= winLength) {return 10000 * previousPlayer;}
            previousPlayer = currentPlayer;
        }
        add = 0;
        previousPlayer = -2;
        currentLength = 0;
    }
    currentLength = 0;
    previousPlayer = -2;
    currentPlayer = 0;
    for(let j = gridSize - 1; j >= winLength - 1; --j) {
        for(let i = 0; j-i >= 0; ++i) {
            currentPlayer = board[(j-i) * gridSize + i];
            if(currentPlayer != 0) {
                if(previousPlayer == currentPlayer) {
                    ++currentLength;
                }
                else if(currentPlayer == previousPlayer * -1) {
                    eval += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; eval += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
            if(currentLength >= winLength) {return 10000 * previousPlayer;}
            previousPlayer = currentPlayer;
        }
        add = 0;
        previousPlayer = -2;
        currentLength = 0;
    }

    if(fullBoard) {return 0;}
    return eval;
}

function updateEval(origin) {
    const player = board[origin];
    const x = Math.floor(origin/gridSize);
    const y = origin%gridSize;
    let eval = 0;

    //horizontal left
    let currentLength = 1;
    let add = 0;
    for(let i = 1; i <= y; ++i) {
        if(board[origin-i] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    //horizontal right
    for(let i = 1; i <= gridSize - y - 1; ++i) {
        if(board[origin+i] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    eval += player * ((currentLength * currentLength) + (add*2));

    //vertical up
    currentLength = 1;
    add = 0;
    for(let i = 1; i <= x; ++i) {
        if(board[origin - (i*gridSize)] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    //vertical down
    for(let i = 1; i <= gridSize - x - 1; ++i) {
        if(board[origin + (i*gridSize)] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    eval += player * ((currentLength * currentLength) + (add*2));

    //diagonal left up
    currentLength = 1;
    add = 0;
    for(let i = 1; i <= x && i <= y; ++i) {
        if(board[origin - (i*gridSize + i)] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    //diagonal right down
    for(let i = 1; i <= (gridSize - x - 1) && i <= (gridSize - y - 1); ++i) {
        if(board[origin + (i*gridSize + i)] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    eval += player * ((currentLength * currentLength) + (add*2));

    //diagonal right up
    currentLength = 1;
    add = 0;
    for(let i = 1; i <= x && i <= (gridSize - y - 1); ++i) {
        if(board[origin - (i*gridSize) + i] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    //diagonal left down
    for(let i = 1; i <= (gridSize - x - 1) && i <= y; ++i) {
        if(board[origin + (i*gridSize) - i] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            eval += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    eval += player * ((currentLength * currentLength) + (add*2));

    return eval;
}

function minimax(player, depth, maxDepth, alpha, beta, lastEval, origin) {
    const minStart = performance.now() * 1000;
    let moveCount = 0
    let bestMoveCount = 0;
    const moveEval = new Array(gridSize * gridSize);
    const moveIndex = new Array(gridSize * gridSize);
    const bestMoves = new Array(gridSize * gridSize);
    let bestEval = -1000000 * player;
    let bestMove = 0;
    let currentEval = lastEval;

    const evalStart = performance.now() * 1000;
    if(depth == 0) {
        currentEval = positionEval();
    }
    else {
        currentEval += updateEval(origin);
    }
    const evalEnd = performance.now() * 1000;
    const diff = evalEnd - evalStart;
    console.log(depth + " | " + currentEval + " - Eval duration = " + diff);

    if(depth == maxDepth) {
        return currentEval;
    }
    else if(currentEval == 10000 || currentEval == -10000) {return (maxDepth+1-depth) * currentEval;}

    let checkCounter = 0;
    for(let i = 0; i < gridSize * gridSize; ++i) {
        if(depth == 0) {console.log(i + " : " + possibleMoves.has(i))}
        if(board[i] == 0 && possibleMoves.has(i)) {
            ++checkCounter;
            if(depth == 0) {console.log(i + "and I did it - " + checkCounter)}
            board[i] = player;
            let prev = new Set(possibleMoves);
            ammendPossibleMoves(Math.floor(i/gridSize), i%gridSize);
            let newEval = minimax(player * -1, depth + 1, maxDepth, alpha, beta, currentEval, i);
            possibleMoves = prev;
            board[i] = 0;

            if(depth == 0) {
                console.log("working");
                moveEval[moveCount] = newEval;
                moveIndex[moveCount] = i;
                ++moveCount;
            }

            if(player == 1) {
                if(newEval > bestEval) {
                    bestEval = newEval;
                    bestMove = i;
                }
                if(alpha < newEval) {
                    alpha = newEval;
                }
                if(beta < alpha) {break;}
            }
            else {
                if(newEval < bestEval) {
                    bestEval = newEval;
                    bestMove = i;
                }
                if(beta > newEval) {
                    beta = newEval;
                }
                if(beta < alpha) {break;}
            } 
        }
    }

    const minEnd = performance.now() * 1000;
    const minDiff = minEnd - minStart;
    if(depth == 1) {
        //console.log(depth + " - Minmax duration = " + minDiff);
    }
    if(depth == 0) {
        //console.log(depth + " - Minmax duration = " + minDiff);
        for(let j = 0; j < moveCount; ++j) {
            if(moveEval[j] == bestEval) {
                bestMoves[bestMoveCount] = moveIndex[j];
                ++bestMoveCount;
            }
        }
        let randomBest = Math.floor(Math.random() * bestMoveCount);
        return bestMoves[randomBest];
    }
    else {return bestEval;}
}