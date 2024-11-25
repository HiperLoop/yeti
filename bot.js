let possibleMoves = new Set();
let previousPossibleMoves = new Set();
let depthModifier = 0;
let bestMovePercent = 100;

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

function positionEval(check=false) {
    let evaluation = 0;
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
                    evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));
                    //if(check) {console.log("added: " + (previousPlayer * ((currentLength * currentLength)+(add*2))) + ", the new total is: " + evaluation)}
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; evaluation += previousPlayer * ((currentLength * currentLength)+(add*2)); fullBoard = false;
                //if(check) {console.log("added: " + (previousPlayer * ((currentLength * currentLength)+(add*2))) + ", the new total is: " + evaluation)}
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
                    evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
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
                    evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
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
                    evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
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
                    evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
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
                    evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));;
                    add = 0;
                    currentLength = 1;
                }
                else if(previousPlayer == 0) {
                    currentLength = 1;
                    add += 1;
                }
                else {currentLength = 1;}
            }   
            else if(previousPlayer != -2){add += 1; evaluation += previousPlayer * ((currentLength * currentLength)+(add*2));; add = 0;}
            if(currentLength >= winLength) {return 10000 * previousPlayer;}
            previousPlayer = currentPlayer;
        }
        add = 0;
        previousPlayer = -2;
        currentLength = 0;
    }

    if(fullBoard) {return 0;}
    return evaluation;
}

function updateEval(origin) {
    const player = board[origin];
    const x = Math.floor(origin/gridSize);
    const y = origin%gridSize;
    let evaluation = 0;

    //horizontal left
    let currentLength = 1;
    let add = 0;
    for(let i = 1; i <= y; ++i) {
        if(board[origin-i] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            evaluation += player;
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
            evaluation += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    evaluation += player * ((currentLength * currentLength) + (add*2));

    //vertical up
    currentLength = 1;
    add = 0;
    for(let i = 1; i <= x; ++i) {
        if(board[origin - (i*gridSize)] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            evaluation += player;
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
            evaluation += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    evaluation += player * ((currentLength * currentLength) + (add*2));

    //diagonal left up
    currentLength = 1;
    add = 0;
    for(let i = 1; i <= x && i <= y; ++i) {
        if(board[origin - (i*gridSize + i)] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            evaluation += player;
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
            evaluation += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    evaluation += player * ((currentLength * currentLength) + (add*2));

    //diagonal right up
    currentLength = 1;
    add = 0;
    for(let i = 1; i <= x && i <= (gridSize - y - 1); ++i) {
        if(board[origin - (i*gridSize) + i] == 0) {
            ++add;
            break;
        }
        else if(board[origin-i] == -1 * player) {
            evaluation += player;
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
            evaluation += player;
            break;
        }
        else if(board[origin-i] == player) {
            ++currentLength;
        }
    }
    evaluation += player * ((currentLength * currentLength) + (add*2));

    return evaluation;
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

module.exports = {makeBotMove};