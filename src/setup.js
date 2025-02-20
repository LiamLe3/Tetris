export function createBoard(rows, cols, selector){
    let board = document.querySelector(selector);
    
    for (let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            let block = `<div class="block ${i} ${j}"></div>`
            board.innerHTML += block;
        }
    }
}