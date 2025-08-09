import { WIDTH, EMPTY, TRANSPARENT, COLORS } from "./constants.js";

/* Clears any filled rows and returns the number of cleared rows */
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

/* Checks if the row is filled */
function isFilledRow(row) {
    return row.every(cell => cell.value !== EMPTY)
}

/* Clears the filled row and uses a callback to draw the cell on the view grid */
function clearRow(index, grid, callback) {
    for(let row=index; row >= 0; row--){
        for(let col=0; col<WIDTH; col++){
            if(row === 0) // Empty last row
                grid[row][col].value = 0; 
            else // Replace current row with above row
                grid[row][col].value = grid[row-1][col].value;
            
            // Draw on view grid
            let value = grid[row][col].value;
            let color = value === EMPTY ? TRANSPARENT : COLORS[value - 1];
            let cell_index = grid[row][col].index;
            callback(color, cell_index);
        }
    }
}