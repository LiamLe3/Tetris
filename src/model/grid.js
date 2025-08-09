import { HEIGHT, WIDTH } from "./constants.js";

/* Creates or resets the model grid */
export function createGrid(){
    let grid = new Array(HEIGHT);
    let index = 0;
    for(let i=0; i<HEIGHT; i++){
        grid[i] = new Array(WIDTH);
        
        // Assign the model grid cell with the index of corresponding view grid cell
        for(let j=0; j<WIDTH; j++){
            grid[i][j] = {
                index: index++,
                value: 0
            }
        }
    }

    return grid;
}

/* Updates the grid with the cells the block locked into */
export function updateGrid(tetromino, grid) {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + j;
            let y = tetromino.y + i;

            if(y < 0) return; // Skips blocks above grid

            if(value > 0) {
                grid[y][x].value = value;
            }
        })
    })
}