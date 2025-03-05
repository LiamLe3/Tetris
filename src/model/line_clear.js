import { WIDTH, EMPTY, TRANSPARENT, COLORS } from "./constants";

export function clearRows(grid, callback) {
        let count = 0;
        grid.forEach((row, index) => {
            if(isFilledRow(row)) { 
                count++;    
                clearRow(index, grid, callback);
            }
        })

        return count;
    }

    function isFilledRow(row) {
        return row.every(cell => cell.value !== EMPTY)
    }

    function clearRow(index, grid, callback) {
        for(let row=index; row >= 0; row--){
            for(let col=0; col<WIDTH; col++){
                if(row === 0) {
                    grid[row][col].value = 0;
                } else {
                    grid[row][col].value = grid[row-1][col].value; 
                }
                
                let value = grid[row][col].value;
                let color = value === 0 ? TRANSPARENT : COLORS[value - 1];
                let a = grid[row][col].index;
                callback(color, a);
            }
        }
    }