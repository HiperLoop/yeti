import {gridSize} from './game.js'
import {node} from './PN_tree.js'

//PN unity: proof number 1 & disproof number 1
const unity = [1, 1];

function getPossibleMoves(board:number[][]) {
    let possibleMoves = [];
    let moveCounter = 0;
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            if(board[i][j]  == 0) {
                possibleMoves[moveCounter] = [i, j];
                ++moveCounter;
            }
        }
    }
    return possibleMoves;
}

function searchNode(origin:node, depth:number, maxDepth:number) {
    //time constraint end
    if(depth == maxDepth) {
        return unity;
    }
    //leaf
    if(origin.children.length == 0) {
        return "<eval>";
    }
    else {

        origin.updateProofNumbers();
    }
}