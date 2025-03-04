
const TRANSPARENT = 'transparent';

const WIDTH = 10;

const EMPTY = 0;

const COLORS = [
    '#c23616',
    '#0097e6',
    '#44bd32',
    '#e1b12c',
    '#8c7ae6',
    '#e84393',
    '#00cec9'
]

import { getRotationResult } from './model/rotation.js';
import { tryMove, moveTetromino } from './model/movement.js';
import { findGhostPosition  } from './model/ghost.js';
import { isValidPosition } from './model/helper.js'
import { getNextTetromino, createTetromino } from './model/factory.js';

export class GameModel {
    constructor() {
        this.holdId = null;
        this.hasSwapped = false;
    }

    getSwapped() {
        return this.hasSwapped;
    }
    
    setDrawCellCallback(callback) {
        this.drawCellCallback = callback;
    }

    setBag() {
        this.bag = [];
    }

    getTetromino() {
        return this.tetromino;
    }

    getGrid() {
        return this.grid;
    }

    getGhostX() {
        return this.ghostX;
    }

    hardDrop() {
        this.tetromino.x = this.ghostX;
    }
    
    getRotationResult(rotation) {
        return getRotationResult(this.tetromino, rotation, this.grid);
    }

    tryMove(movement) {
        return tryMove(this.tetromino, movement, this.grid);
    }

    moveTetromino(movement) {
        moveTetromino(this.tetromino, movement);
    }

    findGhostPosition() {
        this.ghostX = findGhostPosition(this.tetromino, this.grid);
    }

    isValidPosition() {
        return isValidPosition(this.tetromino.x, this.tetromino.y, this.tetromino.block, this.grid);
    }

    getNextTetromino() {
        this.nextBlockId = getNextTetromino(this.bag);
    }

    createTetromino() {
        this.tetromino = createTetromino(this.nextBlockId);
        this.getNextTetromino();
    }

    swapTetromino() {
        if(this.holdId === null) {
            this.holdId = this.tetromino.blockId;
            this.createTetromino();
        } else {
            this.tetromino, this.holdId = createTetromino(this.holdId), this.tetromino.blockId;
        }
    
        this.hasSwapped = true;
    }

    refreshSwap() {
        this.hasSwapped = false;
    }

    createGrid(rows, cols){
        this.grid = new Array(rows);
        let index = 0;
        for(let i=0; i<rows; i++){
            this.grid[i] = new Array(cols);
            
            //Gives grid cell corresponding block index in field
            for(let j=0; j<cols; j++){
                this.grid[i][j] = {
                    index: index++,
                    value: 0
                }
            }
        }
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

    rotateTetromino(result) {
        this.tetromino.block = result.rotatedBlock;
        this.tetromino.x = result.x;
        this.tetromino.y = result.y;
        this.tetromino.orientation = result.newOrientation;
    }
}