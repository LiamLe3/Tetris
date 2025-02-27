export class GameView {
    constructor() {
        this.field = document.getElementsByClassName('block');
    }

    drawTetromino(tetromino, grid) {
        tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = tetromino.x + i;
                let y = tetromino.y + j;
                if(value > 0) {
                    this.field[grid[x][y].index].style.background = tetromino.color;
                }
            })
        })
    }

    clearTetromino(tetromino, grid) {
        tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = tetromino.x + i;
                let y = tetromino.y + j;
                if(value > 0) {
                    this.field[grid[x][y].index].style.background = "transparent";
                }
            })
        })
    }
}