import "./styles.css";

import { handleKeyPress } from "./controller.js"

createBoard(20, 10, ".board-section");

let field = document.getElementsByClassName('block');

document.addEventListener('keydown', handleKeyPress)

function createBoard(rows, cols, selector){
    let board = document.querySelector(selector);
    
    for (let i = 0; i < rows*cols; i++) {
        let block = `<div class="block"></div>`
        board.innerHTML += block;
    }
}

function createGrid (rows, cols){
    let grid = new Array(rows);
    let index = 0;
    for(let i=0; i<rows; i++){
        grid[i] = new Array(cols);
        
        //Gives grid cell corresponding block index in field
        for(let j=0; j<cols; j++){
            grid[i][j] = {
                index: index++,
                value: 0
            }
        }
    }

    return grid;
}

const START_X = 0;
const START_Y = 4;
function createTetromino(block) {

    return {
        block: block,
        x: START_X,
        y: START_Y
    }
}

function drawTetromino(tetromino, grid) {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i;
            let y = tetromino.y + j;
            if(value > 0) {
                field[grid[x][y].index].style.background = "red";
            }
        })
    })
}

function rotateClockwise(matrix) {
    transpose(matrix);
    reverseRows(matrix);
}

function rotateAntiClockwise(matrix){
    transpose(matrix);
    reverseCols(matrix);
}

function transpose(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < i; j++) {
            // Swap the elements across the diagonal
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
}

function reverseRows(matrix) {
    matrix.forEach(row => row.reverse())
}

function reverseCols(matrix) {
    matrix.reverse();
}

const tBlock = [
    [0,3,0],
    [3,3,3],
    [0,0,0]
]

let grid = createGrid(20, 10);
let tetromino = createTetromino(tBlock);
rotateAntiClockwise(tetromino.block);
drawTetromino(tetromino, grid);