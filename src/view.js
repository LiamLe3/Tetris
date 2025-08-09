import { MAX_LEVEL, EMPTY } from "./model/constants.js"

export class GameView {
    constructor() {
        this.createBoard();

        this.board = document.getElementsByClassName('block');
        this.gameLevel = document.querySelector('#game-level');
        this.gameScore = document.querySelector('#game-score');
        this.holdImg = document.querySelector('#hold-block');
        this.nextImg = document.querySelector('#next-block');

        this.playButton = document.querySelector('#btn-play');
        this.menuState = document.querySelector('body');
        this.menuStatus = document.querySelector('.menu-status');

        this.helpSection = document.querySelector('.help-section');

        this.endLevel = document.querySelector('#result-level');
        this.endScore = document.querySelector('#result-score');
    }

    /* Webpage Open */
    createBoard(){
        let board = document.querySelector(".board-section");

        for(let i = 0; i < 200; i++) {
            let block = `<div class="block"></div>`
            board.innerHTML += block;
        }
    }
    /* View Infomation Update */
    updateScore(score) {
        this.gameScore.innerHTML = score;
    }

    updateLevel(level) {
        if(level === MAX_LEVEL)
            this.gameLevel.innerHTML = 'LV. MAX'
        else
            this.gameLevel.innerHTML = 'LV. ' + level;
    }

    updateHoldBlock(holdBlockId = 'empty') {
        const imagePath = require(`./assets/${holdBlockId}.png`);
        this.holdImg.src = imagePath;
    }

    updateNextBlock(nextBlockId) {
        const imagePath = require(`./assets/${nextBlockId}.png`);
        this.nextImg.src = imagePath;
    }

    updateView(score, level, nextId) {
        this.updateScore(score);
        this.updateLevel(level);
        this.updateNextBlock(nextId);
    }

    resetView(nextId) {
        this.updateView(0, 1, nextId);
        this.updateHoldBlock();
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
                        this.board[ghostIndex].style.background = "#5b5b5b";
                        this.board[index].style.background = tetromino.color;
                    } else if (action === 'CLEAR') {
                        this.board[ghostIndex].style.background = "transparent";
                        this.board[index].style.background = "transparent";
                    }
                }
            });
        });
    }

    // Makes every cell in view empty
    clearBoard() {
        [...this.board].forEach((block) => {
            block.style.background = 'transparent';
        });
    }

    /* Menu State */
    displayGame() {
        this.menuState.classList.add('play');
    }

    displayPause() {
        this.menuState.classList.add('pause');
        this.menuState.classList.remove('play');
        this.playButton.innerHTML = 'Resume';
        this.menuStatus.innerHTML = 'PAUSED'
    }

    displayGameOver(score, level) {
        this.menuState.classList.add('game-over');
        this.menuState.classList.remove('play');
        this.endLevel.innerHTML = level;
        this.endScore.innerHTML = score;
        this.menuStatus.innerHTML = 'GAME OVER'
    }

    resumeGame(){
        this.menuState.classList.remove('pause');
    }

    newGame() {
        this.menuState.classList.add('play');
        this.menuState.classList.remove('pause');
        this.menuState.classList.remove('game-over');
        this.clearBoard();
    }

    toggleHelp() {
        this.helpSection.classList.toggle('active');
    }
}