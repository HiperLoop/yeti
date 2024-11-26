class pn_tree {
    constructor(player) {
        this.player = player;
    }
    nodes = {};
    ammendNode(node) {
        this.nodes[node.board] = node;
    }
}

class node {
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
        if(this.type == "AND") {
            let proof = 0;
            let disproof = this.children[0].disproofNumber;
            for(let i = 0; i < this.children.lenght; ++i) {
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
            for(let i = 0; i < this.children.lenght; ++i) {
                disproof += this.children[i].proofNumber;
                proof = Math.min(disproof, this.children[i].disproofNumber);
            }
            this.proofNumber = proof;
            this.disproofNumber = disproof;
        }
    }
    
}

module.exports = {pn_tree, node};