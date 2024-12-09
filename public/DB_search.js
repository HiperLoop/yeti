import { gridSize } from "./game";
class threat {
    constructor(name, squares, level, mask) {
        this.squares = 0;
        this.level = 0;
        this.name = "";
        this.mask = "";
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
const operators = [five, sFour, oFour, bThree, twThree, thThree];
const goals = [Wfive, Wfour];
function decodeMask(mask, moves, attacker) {
    let moveCounter = 0;
    let moveIndex = [];
    if (moves) {
        for (let i = 0; i < mask.length; ++i) {
            if (attacker) {
                if (mask[i] == 'a') {
                    moveIndex[moveCounter] = i;
                    ++moveCounter;
                }
                else if (mask[i] == 'b') {
                    moveIndex[moveCounter] = i;
                    ++moveCounter;
                }
            }
        }
    }
    else {
        for (let i = 0; i < mask.length; ++i) {
            moveIndex[moveCounter] = mask[1] == '1' ? 1 : 0;
        }
    }
    return moveIndex;
}
function checkThreats(position) {
    //vertical
    for (let i = 0; i < gridSize; ++i) {
        for (let j = 0; j < gridSize - 5; ++j) {
            operators.forEach(element => {
                //if all points match the mask of the threat
                for (;;)
                    ;
            });
        }
    }
}
function threatSquares() {
    var threatSquares = [];
    //for(let i = 0; i < ) {}
    return threatSquares;
}
export function DBSearch(position, player, goalSquares, checkDefense = false, maxCategory) {
}
