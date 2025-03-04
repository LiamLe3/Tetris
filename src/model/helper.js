const HEIGHT = 20;
const WIDTH = 10;

export function isValidPosition(newX, newY, block, grid) {
    return block.every((row, i) => {
        return row.every((value, j) => {
            let x = newX + i;
            let y = newY + j;
            if(x < 0) return true;
            return value === 0 || inBoundary(x, y) && isEmpty(x, y, grid);
        })
    })
}

function inBoundary (x, y){
    return x >= 0 && x < HEIGHT && y >= 0 && y < WIDTH;
}

function isEmpty(x, y, grid) {
    return grid[x][y].value === 0;
}