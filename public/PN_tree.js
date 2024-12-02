function convertBase(from, to, input, putZero) {
    const symbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var output = "";
    var toTen = 0;
    //console.log("input: " + input);
    for (let i = 0; i < input.length; ++i) {
        toTen += symbols.indexOf(input[i]) * Math.pow(from, input.length - i - 1);
    }
    console.log("ten: " + toTen);
    if (toTen != 0) {
        for (; toTen > 0;) {
            output = symbols[toTen % to] + output;
            toTen -= (toTen % to);
            toTen /= to;
        }
    }
    else if (putZero) {
        output = "00000";
    }
    return output;
}
function transformBoard(board, compress, gridSize, getPossible) {
    if (compress) {
        var outputString = "";
        var boardString = "";
        var putZero = false;
        for (let i = 0; i < board[0].length; ++i) {
            var boardString = "";
            for (let j = 0; j < board[0].length; ++j) {
                boardString += board[i][j].toString();
            }
            outputString += convertBase(3, 27, boardString, putZero);
            if (outputString != "" || i == gridSize - 2) {
                putZero = true;
            }
        }
        return outputString;
    }
    //decompress
    else if (typeof board === "string") {
        let boardState = [];
        let moves = 0;
        const compressSize = board.length / gridSize;
        for (let i = 0; i < gridSize; ++i) {
            let row = convertBase(27, 3, board.substring(i * compressSize, compressSize), false);
            for (let j = 0; j < gridSize; ++j) {
                if (getPossible) {
                    if (row[j] == "0") {
                        boardState[moves] = [i, j];
                        ++moves;
                    }
                }
                else {
                    boardState[moves] = [i, j];
                }
            }
        }
        return boardState;
    }
    return null;
}
export class pn_tree {
    constructor(player) {
        this.player = 0;
        this.nodes = {};
        this.player = player;
    }
    ammendNode(node) {
        this.nodes[node.boardState] = node;
    }
}
export class node {
    constructor(parent, board, children, proof, disproof) {
        this.parent = parent;
        this.boardState = board;
        this.children = children;
        this.proofNumber = proof;
        this.disproofNumber = disproof;
        //root for player 1 should be OR
        //root for player 2 should be AND
        this.type = parent.type == "AND" ? "OR" : "AND";
    }
    updateProofNumbers() {
        if (this.type == "AND") {
            let proof = 0;
            let disproof = this.children[0].disproofNumber;
            for (let i = 0; i < this.children.length; ++i) {
                proof += this.children[i].proofNumber;
                disproof = Math.min(disproof, this.children[i].disproofNumber);
            }
            this.proofNumber = proof;
            this.disproofNumber = disproof;
        }
        //OR
        else {
            let disproof = 0;
            let proof = this.children[0].disproofNumber;
            for (let i = 0; i < this.children.length; ++i) {
                disproof += this.children[i].proofNumber;
                proof = Math.min(disproof, this.children[i].disproofNumber);
            }
            this.proofNumber = proof;
            this.disproofNumber = disproof;
        }
    }
}
