import { SCORES, LINES_PER_LEVEL, LOCK_DELAY, MAX_LEVEL, BOTTOM } from "./model/constants"

import { createGrid, updateGrid } from './model/grid.js';
import { clearRows } from './model/line_clear.js';
import { getNextTetromino, createTetromino } from './model/factory.js';
import { tryMove, moveTetromino } from './model/movement.js';
import { getRotationResult } from './model/rotation.js';
import { findGhostPosition  } from './model/ghost.js';
import { isValidPosition } from './model/helper.js';


export class GameModel {
    /* Grid Functions */
    createGrid() {
        this.grid = createGrid();
    }

    getGrid() {
        return this.grid;
    }

    updateGrid() {
        updateGrid(this.tetromino, this.grid);
    }


    /* Score Functions */
    resetScore() {
        this.score = 0;
    }

    getScore() {
        return this.score;
    }

    addScore(count){
        this.score += SCORES[count];
    }

    /* Lines Cleared Functions */
    resetLinesCleared() {
        this.linesCleared = 0;
    }

    addLinesCleared(count){
        this.linesCleared += count;
    }

    clearRows() {
        let count = clearRows(this.grid, this.drawCellCallback);

        this.addScore(count);
        this.addLinesCleared(count);
        this.updateLevel();
    }

    /* Level && Speed */
    getSpeed() {
        return (0.8-((this.level-1)*0.007))**(this.level-1) * 1000;
    }

    getLevel() {
        return this.level;
    }

    updateLevel() {
        this.level = Math.floor(this.linesCleared / LINES_PER_LEVEL) + 1;
        this.level = Math.min(this.level, MAX_LEVEL);
    }


    /* Block Factory && Current Block */
    getTetromino() {
        return this.tetromino;
    }

    createTetromino() {
        this.tetromino = createTetromino(this.nextBlockId);
        this.getNextTetromino();
    }


    /* Bag && Next Block */
    resetBag() {
        this.bag = [];
    }

    getNextTetromino() {
        this.nextBlockId = getNextTetromino(this.bag);
    }

    getNextId() {
        return this.nextBlockId;
    }

    /* Movement */
    tryMove(movement) {
        return tryMove(this.tetromino, movement, this.grid);
    }

    moveTetromino(movement) {
        moveTetromino(this.tetromino, movement);
    }

    /* Rotation */
    getRotationResult(rotation) {
        return getRotationResult(this.tetromino, rotation, this.grid);
    }

    rotateTetromino(result) {
        this.tetromino.block = result.rotatedBlock;
        this.tetromino.x = result.x;
        this.tetromino.y = result.y;
        this.tetromino.orientation = result.newOrientation;
    }

    /* Ghost && Hard Drop */
    findGhostPosition() {
        this.ghostY = findGhostPosition(this.tetromino, this.grid);
    }

    getGhostY() {
        return this.ghostY;
    }

    hardDrop() {
        this.tetromino.y = this.ghostY;
    }

    /* Swap && Hold Block */
    resetHoldId() {
        this.holdId = null;
    }

    getHoldId() {
        return this.holdId;
    }

    resetSwap() {
        this.swapped = false;
    }
    
    isSwapped() {
        return this.swapped;
    }

    swapTetromino() {
        let { tetromino, holdId } = this;
        if(this.holdId === null) {
            this.holdId = tetromino.blockId;
            this.createTetromino();
        } else {
            [this.holdId, this.tetromino] = [this.tetromino.blockId, createTetromino(holdId)];
        }
    
        this.swapped = true;
    }

    /* Lock Down */
    resetActionCount() {
        this.actionCount = 0;
    }

    getActionCount() {
        return this.actionCount;
    }

    increaseActionCount() {
        this.actionCount++;
    }

    updateLastMoveTime() {
        this.lastMoveTime = Date.now();
    }

    hasMovedRecently() {
        const currentTime = Date.now();
        return currentTime - this.lastMoveTime <= LOCK_DELAY;
    }

    /* Other Functions */
    isValidPosition() {
        return isValidPosition(this.tetromino.x, this.tetromino.y, this.tetromino.block, this.grid);
    }

    setDrawCellCallback(callback) {
        this.drawCellCallback = callback;
    }

    resetModel() {
        this.createGrid();

        this.resetScore();
        this.resetLinesCleared();
        this.updateLevel();

        this.resetBag()
        this.getNextTetromino();
        this.createTetromino();

        this.resetActionCount();
        this.resetHoldId();
        this.resetSwap();

        this.updateLastMoveTime();
    }

    prepareNextTetromino() {
        this.createTetromino();
        this.resetActionCount();
        this.resetSwap();
    }
}