export class GameView {
    constructor() {
        this.field = document.getElementsByClassName('block');
    }

    drawCell(color, index) {
        this.field[index].style.background = color;
    }

    drawTetromino(tetromino, grid, ghostX = 0) {
        tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = tetromino.x + i;
                let y = tetromino.y + j;

                if(x < 0) return; // Stops drawings above grid

                if(value > 0) {
                    let ghostIndex = grid[ghostX + i][y].index;
                    this.field[ghostIndex].style.background = "grey";
                    
                    let index = grid[x][y].index;
                    this.field[index].style.background = tetromino.color;
                }
            })
        })
    }

    clearTetromino(tetromino, grid, ghostX = 0) {
        tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = tetromino.x + i;
                let y = tetromino.y + j;

                if(x<0) return; // Stops clearing above grid

                if(value > 0) {
                    let ghostIndex = grid[ghostX + i][y].index;
                    this.field[ghostIndex].style.background = "transparent";

                    let index = grid[x][y].index;
                    this.field[index].style.background = "transparent";
                }
            })
        })
    }
}