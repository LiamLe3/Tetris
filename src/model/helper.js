import { HEIGHT, WIDTH, EMPTY } from "./constants.js";

/* Checks if the given tetromino position is valid */
export function isValidPosition(newX, newY, block, grid) {
    return block.every((row, i) => {
        return row.every((value, j) => {
            let x = newX + j;
            let y = newY + i;
            if(y < 0) return true; // ignores blocks above the grid
            return value === EMPTY || inBoundary(x, y) && isEmpty(x, y, grid);
        })
    })
}

/* Checks if the tetromino will be inside the walls of the game */
function inBoundary (x, y){
    return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
}

/* Checks if the cell the tetromino is trying to move into is empty */
function isEmpty(x, y, grid) {
    return grid[y][x].value === EMPTY;
}