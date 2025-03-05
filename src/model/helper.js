import { HEIGHT, WIDTH } from "./constants";

export function isValidPosition(newX, newY, block, grid) {
    return block.every((row, i) => {
        return row.every((value, j) => {
            let x = newX + j;
            let y = newY + i;
            if(y < 0) return true;
            return value === 0 || inBoundary(x, y) && isEmpty(x, y, grid);
        })
    })
}

function inBoundary (x, y){
    return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
}

function isEmpty(x, y, grid) {
    return grid[y][x].value === 0;
}