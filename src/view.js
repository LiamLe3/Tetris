export class GameView {
    constructor() {
        this.field = document.getElementsByClassName('block');
        this.viewScore = document.querySelector('#score');
        this.level = document.querySelector('#level');
        this.holdblock = document.querySelector('hold-block');
        this.nextBlock = document.querySelector('next-block');
    }

    updateScore(score) {
        this.viewScore.innerHTML = score;
    }

    updateLevel(level) {
        this.viewScore.innerHTML = 'LV. ' + level;
    }

    displayHoldBlock(holdBlockId) {

    }

    displayNextBlock(nextBlockId) {

    }

    drawCell(color, index) {
        this.field[index].style.background = color;
    }

    drawTetromino(tetromino, grid, ghostY, action) {
        tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = tetromino.x + j;
                let y = tetromino.y + i;
    
                if (y < 0) return; // Prevent drawing/clearing above grid
    
                if (value > 0) {
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