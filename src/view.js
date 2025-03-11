import { MAX_LEVEL, EMPTY, GAME_STATE } from "./model/constants"

export class GameView {
    constructor() {
        this.board = document.getElementsByClassName('block');
        this.gameLevel = document.querySelector('#level');
        this.gameScore = document.querySelector('#score');
        this.holdblock = document.querySelector('#hold-block');
        this.nextBlock = document.querySelector('#next-block');
        
        this.endLevel = document.querySelector('#result-level');
        this.endLevel = document.querySelector('#result-score');

        this.playButton = document.querySelector('#btn-play');

        this.menuState = document.querySelector('body');
    }

    /* Info updates */
    // Updates the score in view
    updateScore(score) {
        this.gameScore.innerHTML = score;
    }

    // Updates the level in view
    updateLevel(level) {
        if(level === MAX_LEVEL)
            this.gameLevel.innerHTML = 'LV. MAX'
        else
            this.gameLevel.innerHTML = 'LV. ' + level;
    }

    // Updates the current hold block
    displayHoldBlock(holdBlockId) {

    }

    // Updates the next block
    displayNextBlock(nextBlockId) {

    }

    resetView(score, level, holdId, nextId) {
        this.updateScore(score);
        this.updateLevel(level);

        this.displayHoldBlock(holdId);
        this.displayNextBlock(nextId);
    }

    updateView(score, level, nextId) {
        this.updateScore(score);
        this.updateLevel(level);
        this.displayNextBlock(nextId);
    }

    /* Drawing */
    // Used as a callback in clearRow in line_clear.js
    drawCell(color, index) {
        this.board[index].style.background = color;
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
                        this.board[ghostIndex].style.background = "grey";
                        this.board[index].style.background = tetromino.color;
                    } else if (action === 'CLEAR') {
                        this.board[ghostIndex].style.background = "transparent";
                        this.board[index].style.background = "transparent";
                    }
                }
            });
        });
    }

    /* Menu State */
    displayGameOver(score, level) {
        this.menuState.classList.add('game-over');
        this.menuState.classList.remove('play');
        this.endLevel.innerHTML = level;
        this.endScore.innerHTML = score;
    }

    displayPause() {
        this.menuState.classList.add('pause');
        this.menuState.classList.remove('play');
        this.playButton.innerHTML = 'Resume';
    }

    displayGame() {
        this.menuState.classList.add('play');
    }

    setGamePlay() {
        this.menuState.classList.add('play');
    }

    resumeGame(){
        this.menuState.classList.remove('pause');
    }
}