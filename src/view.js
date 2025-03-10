import { MAX_LEVEL, EMPTY, BOTTOM } from "./model/constants"

export class GameView {
    constructor() {
        this.field = document.getElementsByClassName('block');
        this.viewScore = document.querySelector('#score');
        this.level = document.querySelector('#level');
        this.holdblock = document.querySelector('#hold-block');
        this.nextBlock = document.querySelector('#next-block');
    }

    /* Info updates */
    // Updates the score in view
    updateScore(score) {
        this.viewScore.innerHTML = score;
    }

    // Updates the level in view
    updateLevel(level) {
        if(level === MAX_LEVEL)
            this.viewScore.innerHTML = 'LV. MAX'
        else
            this.viewScore.innerHTML = 'LV. ' + level;
    }


    // Updates the current hold block
    displayHoldBlock(holdBlockId) {

    }

    // Updates the next block
    displayNextBlock(nextBlockId) {

    }


    /* Drawing */
    // Used as a callback in clearRow in line_clear.js
    drawCell(color, index) {
        this.field[index].style.background = color;
    }

    // Draws or clears the tetromino on the view board
    drawTetromino(tetromino, grid, ghostY, action) {
        tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = tetromino.x + j;
                let y = tetromino.y + i;
    
                if (y < 0) return; // Prevent drawing/clearing above grid
    
                if (value > EMPTY) {
                    const ghostIndex = grid[ghostY + i][x].index;
                    const index = grid[y][x].index;
    
                    // Perform action (draw or clear)
                    if (action === 'DRAW') {
                        this.field[ghostIndex].style.background = "grey";
                        this.field[index].style.background = tetromino.color;
                    } else if (action === 'CLEAR') {
                        this.field[ghostIndex].style.background = "transparent";
                        this.field[index].style.background = "transparent";
                    }
                }
            });
        });
    }
}