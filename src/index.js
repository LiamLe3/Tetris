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

function clearTetromino(tetromino, grid) {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i;
            let y = tetromino.y + j;
            if(value > 0) {
                field[grid[x][y].index].style.background = "transparent";
            }
        })
    })
}

function rotateClockwise(tetromino, grid){
    if(!moveable(tetromino, grid, CLOCKWISE)) return;
    clearTetromino(tetromino, grid);
    transpose(tetromino.block);
    reverseRows(tetromino.block);
    drawTetromino(tetromino, grid);
}

function rotateAntiClockwise(tetromino, grid){
    if(!moveable(tetromino, grid, ANTICLOCKWISE)) return;
    clearTetromino(tetromino, grid);
    transpose(tetromino.block);
    reverseCols(tetromino.block);
    drawTetromino(tetromino, grid);
}

function transpose(block) {
    for (let i = 0; i < block.length; i++) {
        for (let j = 0; j < i; j++) {
            // Swap the elements across the diagonal
            [block[i][j], block[j][i]] = [block[j][i], block[i][j]];
        }
    }
}

function reverseRows(block) {
    block.forEach(row => row.reverse())
}

function reverseCols(block) {
    block.reverse();
}

function shiftLeft(tetromino, grid) {
    if(!moveable(tetromino, grid, LEFT)) return;
    clearTetromino(tetromino, grid);
    tetromino.y -= 1;
    drawTetromino(tetromino, grid);
}

function shiftRight(tetromino, grid) {
    if(!moveable(tetromino, grid, RIGHT)) return;
    clearTetromino(tetromino, grid);
    tetromino.y += 1;
    drawTetromino(tetromino, grid);
}

function shiftDown(tetromino, grid) {
    if(!moveable(tetromino, grid, DOWN)) return;
    clearTetromino(tetromino, grid);
    tetromino.x += 1;
    drawTetromino(tetromino, grid);
}

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';
const CLOCKWISE = 'CLOCKWISE';
const ANTICLOCKWISE = 'ANTICLOCKWISE';
function moveable(tetromino, grid, direction) {
    let newX = tetromino.x;
    let newY = tetromino.y;
    let cloneBlock = tetromino.block;
    switch(direction){
        case DOWN:
            newX += 1;
            break;
        case LEFT:
            newY -= 1;
            break;
        case RIGHT:
            newY += 1;
            break;
        case CLOCKWISE:
            cloneBlock = JSON.parse(JSON.stringify(tetromino.block));
            console.log(JSON.parse(JSON.stringify(cloneBlock)));
            transpose(cloneBlock);
            reverseCols(cloneBlock)
            console.log(JSON.parse(JSON.stringify(cloneBlock)));
            break;
        case ANTICLOCKWISE:
            cloneBlock = JSON.parse(JSON.stringify(tetromino.block));
            rotateAntiClockwise(cloneBlock);
            break;
    }

    return isValidMovement(newX, newY, cloneBlock, grid)
}

function isValidMovement(newX, newY, block, grid) {
    return block.every((row, i) => {
        return row.every((value, j) => {
            let x = newX + i;
            let y = newY + j;
            return value === 0 || isInBoundary(x, y) && isEmpty(x, y, grid);
        })
    })
}

function isInBoundary (x, y){
    return x >= 0 && x < 20 && y >=0 && y < 9;
}

function isEmpty(x, y, grid) {
    return grid[x][y].value === 0;
}

const tBlock = [
    [0,3,0],
    [3,3,3],
    [0,0,0]
]

let grid = createGrid(20, 10);
let tetromino = createTetromino(tBlock);
drawTetromino(tetromino, grid);
rotateClockwise(tetromino, grid);
