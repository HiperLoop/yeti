import { gridSize } from "./game";

class threat {
    public squares:number = 0;
    public level:number = 0;
    public name:string = "";
    public mask:string = "";
    constructor(name:string, squares:number, level:number, mask:string) {
        this.squares = squares;
        this.level = level;
        this.name = name;
        this.mask = mask;
    }
}

//operators
const five = new threat("five", 5, 0, "1111a");
const sFour = new threat("sFour", 6, 1, "0111a0");
const oFour = new threat("oFour", 5, 1, "111ab");
const bThree = new threat("bThree", 6, 2, "b11bab");
const twThree = new threat("twThree", 7, 2, "0b11ab0");
const thThree = new threat("thThree", 6, 2, "bb11ab");

//wins
const Wfive = new threat("Wfive", 5, 0, "11111");
const Wfour = new threat("Wfour", 6, 0, "a1111a");

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
            moveIndex[moveCounter] = mask[1] == '1' ? 1 : 0;
        }
    }
    return moveIndex;
}

function checkThreats(position:number[][], player:number) {
    var threatMoves:number[][] = [];
    //horizontal
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize - 5; ++j) {
            operators.forEach(element => {
                const mask = decodeMask(element.mask);
                //if all points match the mask of the threat
                //one direction
                for(let k = 0; k < element.squares; ++k) {
                    if(position[i][j] != mask[k]) {
                        break;
                    }
                    //if we get to last square = the mask is present
                    if(k == element.squares - 1) {
                        
                    }
                    
                }
                //reverse
                for(let k = 1; k <= element.squares; ++k) {
                    if(position[i][j] != mask[element.squares - k]) {
                        break;
                    }

                    
                }
            });
        }
    }

}

function threatSquares():threat[][] {
    var threatSquares:threat[][] = [];

    //for(let i = 0; i < ) {}

    return threatSquares;
}

export function DBSearch(position:number[][], player:number, goalSquares:number[][], checkDefense:boolean = false, maxCategory:number) {

}
