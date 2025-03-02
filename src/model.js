const UP = 'UP';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';
const CLOCKWISE = 'CLOCKWISE';
const ANTICLOCKWISE = 'ANTICLOCKWISE';
const TRANSPARENT = 'transparent';

const START_X = 0;
const START_Y = 3;

const HEIGHT = 20;
const WIDTH = 10;

const LINE = 0;
const SQUARE = 1;
const OTHER = 2;
const EMPTY = 0;

const ORIENTATIONS = 4;
const START_O = 0;
const RIGHT_O = 1;
const FLIP_O = 2;
const LEFT_O = 3;

const ROTATE_RIGHT = 1;
const ROTATE_LEFT = -1;


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

const lineKickTable = [
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: -1}, {x: 1, y: 2}], //0->R L->2 [Move East]
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -2}], //2->L R->0  [Move West]
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}], //R->2 0->L [Move South]
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: -2}, {x: -2, y: 1}] //L->0 2->R [Move North]
];

const otherKickTable = [
    [{x: 0, y: 0}, {x: 0, y: -1}, {x: -1, y: -1}, {x: 2, y: 0}, {x: 2, y: -1}], // L->2 L->0 [Starts from L]
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}, {x: 2, y: 0}, {x: 2, y: 1}], // R->0 R->2 [Starts from R]
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: -2, y: 0}, {x: -2, y: 1}], // 2->L 0->L [Ends in L]
    [{x: 0, y: 0}, {x: 0, y: -1}, {x: 1, y: -1}, {x: -2, y: 0}, {x: -2, y: -1}] // 0->R 2->R [Ends in R]       
];

/*
    (0->R L->2)
    (R->0 2->L)
    (R->2 0->L)
    (2->R L->0)

*/
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

    setDrawCellCallback(callback) {
        this.drawCellCallback = callback;
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
            block: JSON.parse(JSON.stringify(BLOCKS[index])),
            color: COLORS[index],
            x: START_X,

            //Adjusts position for Square spawns
            y: index === SQUARE ? START_Y + SQUARE : START_Y,

            //for wall kicks, blocks that are not line or square have same behaviour
            kickId: index > SQUARE ? OTHER : index,
            orientation: 0
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

    checkRows() {
        this.grid.forEach((row, index) => {
            if(this.isFilledRow(row)) {     
                this.clearRow(index);
            }
        })
    }

    isFilledRow(row) {
        return row.every(cell => {
            return cell.value !== EMPTY;
        })
    }

    clearRow(index) {
        for(let row=index; row >= 0; row--){
            for(let col=0; col<WIDTH; col++){
                if(row === 0) {
                    this.grid[row][col].value = 0;
                } else {
                    this.grid[row][col].value = this.grid[row-1][col].value; 
                }
                
                let value = this.grid[row][col].value;
                let color = value === 0 ? TRANSPARENT : COLORS[value - 1];
                let index = this.grid[row][col].index;
                this.drawCellCallback(color, index);
            }
        }
    }

    updateGrid() {
        this.tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = this.tetromino.x + i;
                let y = this.tetromino.y + j;

                if(x < 0) return; // Skips blocks above grid

                if(value > 0) {
                    this.grid[x][y].value = value;
                }
            })
        })
    }

    tryMove(movement) {
        let newX = this.tetromino.x;
        let newY = this.tetromino.y;

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
        }

        return this.isValidPosition(newX, newY);
    }

    tryRotate(rotation) {
        let direction;
        let cloneBlock = JSON.parse(JSON.stringify(this.tetromino.block));

        this.transpose(cloneBlock);
        if(rotation === CLOCKWISE) {
            direction = ROTATE_RIGHT;
            this.reverseRows(cloneBlock);
        } else {
            direction = ROTATE_LEFT;
            this.reverseCols(cloneBlock);
        }
        
        console.log(cloneBlock);

        let currentOrientation = this.tetromino.orientation;
        let endOrientation = (currentOrientation + direction) % ORIENTATIONS;
        let testId;
        let result;
        switch(this.tetromino.kickId) {
            case LINE:
                testId = this.getIBlockTest(currentOrientation, endOrientation);
                result = this.runIBlockTest(testId, cloneBlock);
                return {
                    ...result,
                    newOrientation: endOrientation
                }
            case SQUARE:
                return {
                    rotatable: false
                }
            case OTHER:
                testId = this.getOtherBlockTest(currentOrientation, endOrientation);
                result = this.runOtherBlockTest(testId, cloneBlock);
                return {
                    ...result,
                    newOrientation: endOrientation
                }
        }
    }

    updateTetromino(result) {
        this.tetromino.block = result.cloneBlock;
        this.tetromino.x = result.x;
        this.tetromino.y = result.y;
        this.tetromino.orientation = result.newOrientation;
    }

    runIBlockTest(testId, block){
        let result = { rotatable: false };

        lineKickTable[testId].some(test => {
            let newX = this.tetromino.x + test.x;
            let newY = this.tetromino.y + test.y;
            if(this.isValidPosition(newX, newY, block)) {
                result = {
                    rotatable: true,
                    cloneBlock: block,
                    x: newX,
                    y: newY
                };
                
                return true;
            }

            return false;
        })

        return result;
    }

    runOtherBlockTest(testId, block) {
        let result = { rotatable: false };

        otherKickTable[testId].some(test => {
            let newX = this.tetromino.x + test.x;
            let newY = this.tetromino.y + test.y;

            if(this.isValidPosition(newX, newY, block)) {
                result = {
                    rotatable: true,
                    cloneBlock: block,
                    x: newX,
                    y: newY
                };
                
                return true;
            }

            return false;
        })

        return result;
    }

    getIBlockTest (currentOrientation, endOrientation){
        if((currentOrientation === 0 && endOrientation === RIGHT_O)
            || currentOrientation === LEFT_O && endOrientation === FLIP_O){
            return 0;
        } else if((currentOrientation === FLIP_O && endOrientation === LEFT)
            || currentOrientation === RIGHT && endOrientation === START_O){
            return 1;
        } else if((currentOrientation === RIGHT && endOrientation === FLIP_O)
            || currentOrientation === START_O && endOrientation === LEFT){
            return 2;
        } else {
            return 3;
        } 
    }

    getOtherBlockTest(currentOrientation, endOrientation) {
        if(currentOrientation === LEFT_O) {
            return 0;
        } else if(currentOrientation === RIGHT_O) {
            return 1;
        } else if(endOrientation === LEFT_O) {
            return 2
        } else {
            return 3;
        }
    }

    moveTetromino(direction) {
        switch(direction) {
            case UP:
                this.tetromino.x -= 1;
                break;
            case DOWN:
                this.tetromino.x += 1;
                break;
            case LEFT:
                this.tetromino.y -= 1;
                break;
            case RIGHT:
                this.tetromino.y += 1;
                break;
        }
    }

    isValidPosition(newX, newY, block = this.tetromino.block) {
        return block.every((row, i) => {
            return row.every((value, j) => {
                let x = newX + i;
                let y = newY + j;
                if(x < 0) return true;
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