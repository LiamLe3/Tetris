import "./styles.css";

import { handleKeyPress } from "./controller.js"

createBoard(20, 10, ".board-section");

let field = document.getElementsByClassName('block');

document.addEventListener('keydown', handleKeyPress)

function createBoard(rows, cols, selector){
    let board = document.querySelector(selector);
    
    for (let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            let block = `<div class="block ${i} ${j}"></div>`
            board.innerHTML += block;
        }
    }
}

function createGrid (rows, cols){
    let grid = new Array(rows);
    for(let i=0; i<rows; i++){
        grid[i] = new Array(cols).fill(0);
    }
    return grid;
}

const tBlock = [
    [0,3,0],
    [3,3,3],
    [0,0,0]
]

function genTetromino(block, color, start_x, start_y){
    return {
        block: block,
        color: '#44bd32',
        x: start_x,
        y: start_y
    }
}

function drawTetromino(tetromino, grid){
    tetromino.block.forEach(i => {
        i.forEach(j => {
            console.log(j);
            /*
            let row = tetromino.x + i;
            let col = tetromino.y + j;
            field[row][col].style.background = tetromino.color;*/
        })
    })
}

let grid = createGrid(20, 10);
let tetromino = genTetromino(tBlock, '#44bd32', 0, 4);
drawTetromino(tetromino, grid);

field[0].style.background = tetromino.color;