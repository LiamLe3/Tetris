export class GameView {
    constructor() {
        this.field = document.getElementsByClassName('block');
    }

    drawCell(color, index) {
        this.field[index].style.background = color;
    }

    drawTetromino(tetromino, grid) {
        tetromino.block.forEach((row, i) => {
            row.forEach((value, j) => {
                let x = tetromino.x + i;
                let y = tetromino.y + j;
                if(value > 0) {
                    let index = grid[x][y].index;
                    this.field[index].style.background = tetromino.color;
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
                    let index = grid[x][y].index;
                    this.field[index].style.background = "transparent";
                }
            })
        })
    }
}