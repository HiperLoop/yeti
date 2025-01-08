import { gridSize } from "./game.js";

//TODO
//change direction from any[] to number[]

class threat {
    public squares:number = 0;
    public level:number = 0;
    public name:string = "";
    public mask:string = "";
    public simpleMask:number[] = [];
    public direction:any[] = [];
    public start:number[] = [];
    constructor(name:string, squares:number, level:number, mask:string, simpleMask:number[]) {
        this.squares = squares;
        this.level = level;
        this.name = name;
        this.mask = mask;
        this.simpleMask = simpleMask;
    }

    makeBoardThreat(start:number[], direction:any[]) {
        this.start = start;
        this.direction = direction;
    }

    play(board:number[][], player:number) {
        for(let i = 0; i < this.squares; ++i) {
            const currentSquare:number[] = [[this.start[0]+i*this.direction[0]][this.start[1]+i*this.direction[1]]];
            board[currentSquare[0]][currentSquare[1]] = this.mask[i] == 'a' ? player : this.mask[i] == 'b' ? player*-1 : board[currentSquare[0]][currentSquare[1]];
        }
    }

    reverse(board:number[][]) {
        for(let i = 0; i < this.squares; ++i) {
            const currentSquare:number[] = [[this.start[0]+i*this.direction[0]][this.start[1]+i*this.direction[1]]];
            board[currentSquare[0]][currentSquare[1]] = this.mask[i] == 'a' || 'b' ? 0 : board[currentSquare[0]][currentSquare[1]];
        }
    }
}

//operators
const five = new threat("five", 5, 0, "1111a", [1, 1, 1, 1, 0]);
const sFour = new threat("sFour", 6, 1, "0111a0", [0, 1, 1, 1, 0, 0]);
const oFour = new threat("oFour", 5, 1, "111ab", [1, 1, 1, 0, 0]);
const bThree = new threat("bThree", 6, 2, "b11bab", [0, 1, 1, 0, 0, 0]);
const twThree = new threat("twThree", 7, 2, "0b11ab0", [0, 0, 1, 1, 0, 0, 0]);
const thThree = new threat("thThree", 6, 2, "bb11ab", [0, 0, 1, 1, 0, 0]);

//wins
const Wfive = new threat("Wfive", 5, 0, "11111", [1, 1, 1, 1, 1]);
const Wfour = new threat("Wfour", 6, 0, "a1111a", [0, 1, 1, 1, 1, 0]);

const operators:threat[] = [five, sFour, oFour, bThree, twThree, thThree];
const goals:threat[] = [Wfive, Wfour];

function decodeMask(mask:string, moves?:boolean, attacker?:boolean) {
    let moveCounter = 0;
    let moveIndex:number[] = [];
    if(moves) {
        for(let i = 0; i < mask.length; ++i) {
            if(attacker) {
                if(mask[i] == 'a') {
                    moveIndex[moveCounter] = i;
                    ++moveCounter;
                }
                else if(mask[i] == 'b'){
                    moveIndex[moveCounter] = i;
                    ++moveCounter;
                }
            }
        }
    }
    else {
        for(let i = 0; i < mask.length; ++i) {
            moveIndex[i] = mask[i] == '1' ? 1 : 0;
        }
    }
    return moveIndex;
}

function directionalThreaatFinder(direction:number[], position:number[][], player:number) {
    const foundThreats:threat[] = [];
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            operators.some(currentThreat => {
                const mask = currentThreat.simpleMask;
                //if all points match the mask of the threat
                for(let k = 0; k < currentThreat.squares; ++k) {
                    //check if out of board
                    if(i+k*direction[0] < 0 || j+k*direction[1] < 0 || i+k*direction[0] == gridSize || j+k*direction[1] == gridSize) {
                        break;
                    }
                    //check mask
                    if(position[i+k*direction[0]][j+k*direction[1]] != mask[k] * player) {
                        break;
                    }
                    //if we get to last square = the mask is present
                    if(k == currentThreat.squares - 1) {
                        console.log(direction[2] + " - " + currentThreat.name);
                        foundThreats.push(new threat(currentThreat.name, currentThreat.squares, currentThreat.level, currentThreat.mask, currentThreat.simpleMask));
                        foundThreats[foundThreats.length-1].makeBoardThreat([i, j], direction);
                        return true;
                    }
                    
                }
            });
        }
    }
    return foundThreats;
}

export function checkThreats(position:number[][], player:number = 1) {
    console.log("Checking of threats started, gridsize: " + gridSize);
    var threatMoves:number[][] = [];
    const directions:any[][] = [
    [1, 0, "down"], //down
    [-1, 0, "up"], //up
    [0, 1, "right"], //right
    [0, -1, "left"], //left
    [1, 1, "down right"], //down right
    [1, -1, "down left"], //down left
    [-1, 1, "up right"], //up right
    [-1, -1, "up left"], //up left
    ];

    //check every direction for threats
    const allFoundThreats:threat[] = [];
    directions.some(direction => {
        directionalThreaatFinder(direction, position, player).some(foundThreat => {
            allFoundThreats.push(foundThreat);
        });
    });
    return allFoundThreats;
}

function threatSquares():threat[][] {
    var threatSquares:threat[][] = [];

    //for(let i = 0; i < ) {}

    return threatSquares;
}

export function DBSearch(position:number[][], player:number, goalSquares:number[][], checkDefense:boolean = false, maxCategory:number) {
    
}
