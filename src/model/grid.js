import { HEIGHT, WIDTH } from "./constants";

export function createGrid(){
    let grid = new Array(HEIGHT);
    let index = 0;
    for(let i=0; i<HEIGHT; i++){
        grid[i] = new Array(WIDTH);
        
        //Gives grid cell corresponding block index in field
        for(let j=0; j<WIDTH; j++){
            grid[i][j] = {
                index: index++,
                value: 0
            }
        }
    }

    return grid;
}

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