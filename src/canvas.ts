export function isHigh(windowSize:number[]): boolean {
    return windowSize[1] > windowSize[0] ? true : false;
}

export function maxSize(windowSize:number[]) {
    return isHigh(windowSize) ? windowSize[0] - 10 : windowSize[1] - 10;
}

function resizeCanvas(windowSize:number[], canvas:HTMLCanvasElement) {
    const setSize = maxSize(windowSize);
    canvas.width = setSize;
    canvas.height = setSize;
}

export function drawGrid(gridSize:number, windowSize:number[], canvas:HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if(ctx) {
        ctx.strokeStyle = "#000000"
        ctx.fillStyle = "#DCB35C";
        const size = maxSize(windowSize);
        ctx.fillRect(0, 0, size, size);

        for(let i = 0; i < gridSize; ++i) {
            const rectSize = canvas.height/gridSize;
            const start = 0.5 * rectSize;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(start-1 + i*rectSize, start-1);
            ctx.lineTo(start-1 + i*rectSize, canvas.height - start);
            ctx.moveTo(start-1, start-1 + i*rectSize);
            ctx.lineTo(canvas.height - start, start-1 + i*rectSize);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

export function resize_canvas(windowSize:number[], canvas:HTMLCanvasElement, gridSize:number, board:number[][]) {
    resizeCanvas(windowSize, canvas);
    drawGrid(gridSize, windowSize, canvas);
    drawBoard(board, gridSize);
}

export function drawMove(i:number, j:number, player:number, gridSize:number) {
    const c = <HTMLCanvasElement> document.getElementById("myCanvas");
    const ctx = c.getContext("2d");

    if(ctx) {
        ctx.beginPath();
        const rectSize = c.height/gridSize;

        ctx.fillStyle = "#000000";
        if(player == -1) {ctx.fillStyle = "#ffffff";}

        ctx.moveTo(j * rectSize + (rectSize/4 * 3), i * rectSize + (rectSize/2));
        ctx.arc(j * rectSize + (rectSize/2), i * rectSize + (rectSize/2), rectSize/4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

function drawBoard(board:number[][], gridSize:number) {
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            if(board[i][j] != 0) {
                drawMove(i, j, board[i][j], gridSize);
            }
        }
    }
}

export function drawWin(start:number[], end:number[], gridSize:number) {
    console.log(start + " - " + end);
    const c = <HTMLCanvasElement> document.getElementById("myCanvas");
    const ctx =  c.getContext("2d");
    const rectSize = c.height/gridSize;

    if(ctx) {
        ctx.beginPath();
        ctx.moveTo(start[1]*rectSize + rectSize/2, start[0]*rectSize + rectSize/2);
        ctx.lineTo(end[1]*rectSize + rectSize/2, end[0]*rectSize + rectSize/2);
        ctx.lineWidth = 10;
        ctx.stroke();
    }
}