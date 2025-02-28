const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';
const CLOCKWISE = 'CLOCKWISE';
const ANTICLOCKWISE = 'ANTICLOCKWISE';

const START_X = 0;
const START_Y = 3;

const HEIGHT = 20;
const WIDTH = 10;

const SQUARE_INDEX = 1;

const iBlock = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

const oBlock = [
    [2,2],
    [2,2]
]

const tBlock = [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0]
]

const sBlock = [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0]
]

const zBlock = [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0]
]

const lBlock = [
    [0, 0, 6],
    [6, 6, 6],
    [0, 0, 0]
]

const jBlock = [
    [7, 0, 0],
    [7, 7, 7],
    [0, 0, 0]
]

const BLOCKS = [ iBlock, oBlock, tBlock, sBlock, zBlock, lBlock, jBlock ];
const COLORS = [
    '#c23616',
    '#0097e6',
    '#44bd32',
    '#e1b12c',
    '#8c7ae6',
    '#e84393',
    '#00cec9'
]

export class GameModel {
    constructor() {
        this.tetromino = null;
        this.grid = this.createGrid(HEIGHT, WIDTH);
    }

    getTetromino() {
        return this.tetromino;
    }

    getGrid() {
        return this.grid;
    }

    createTetromino() {
        let index = Math.floor(Math.random() * BLOCKS.length);
        this.tetromino = {
            block: BLOCKS[index],
            color: COLORS[index],
            x: START_X,
            //If selected block shape is square, start position 1 block to right
            y: index === SQUARE_INDEX ? START_Y : START_Y
        }
    }

    createGrid(rows, cols){
        let grid = new Array(rows);
        let index = 0;
        for(let i=0; i<rows; i++){
            grid[i] = new Array(cols);
            
            //Gives grid cell corresponding block index in field
            for(let j=0; j<cols; j++){
                grid[i][j] = {
                    index: index++,
                    value: 0
                }
            }
        }
    
        return grid;
    }

    updateGrid() {
        this.tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = this.tetromino.x + i;
                let y = this.tetromino.y + j;
                if(value > 0) {
                    this.grid[x][y].value = value;
                }
            })
        })
    }
    tryMove(movement) {
        let newX = this.tetromino.x;
        let newY = this.tetromino.y;
        let cloneBlock = this.tetromino.block;

        switch(movement) {
            case DOWN:
                newX += 1;
                break;
            case LEFT:
                newY -= 1;
                break;
            case RIGHT:
                newY += 1;
                break;
            case CLOCKWISE:
                cloneBlock = JSON.parse(JSON.stringify(this.tetromino.block));
                this.transpose(cloneBlock);
                this.reverseRows(cloneBlock)
                break;
        }

        return this.isValidMovement(newX, newY, cloneBlock);
    }

    moveTetromino(direction) {
        switch(direction) {
            case DOWN:
                this.tetromino.x += 1;
                break;
            case LEFT:
                this.tetromino.y -= 1;
                break;
            case RIGHT:
                this.tetromino.y += 1;
                break;
            case CLOCKWISE:
                this.transpose(this.tetromino.block);
                this.reverseRows(this.tetromino.block);
        }
    }

    isValidMovement(newX, newY, block) {
        return block.every((row, i) => {
            return row.every((value, j) => {
                let x = newX + i;
                let y = newY + j;
                return value === 0 || this.inBoundary(x, y) && this.isEmpty(x, y);
            })
        })
    }

    inBoundary (x, y){
        return x >= 0 && x < HEIGHT && y >= 0 && y < WIDTH;
    }
    
    isEmpty(x, y) {
        return this.grid[x][y].value === 0;
    }

    transpose(block) {
        for (let i = 0; i < block.length; i++) {
            for (let j = 0; j < i; j++) {
                // Swap the elements across the diagonal
                [block[i][j], block[j][i]] = [block[j][i], block[i][j]];
            }
        }
    }
    
    reverseRows(block) {
        block.forEach(row => row.reverse())
    }
    
    reverseCols(block) {
        block.reverse();
    }
}