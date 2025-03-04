const UP = 'UP';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';

import { isValidPosition } from './helper.js';

export function tryMove(tetromino, movement, grid) {
    let newX = tetromino.x;
    let newY = tetromino.y;

    switch(movement) {
        case UP:
            newX -= 1;
        case DOWN:
            newX += 1;
            break;
        case LEFT:
            newY -= 1;
            break;
        case RIGHT:
            newY += 1;
            break;
    }

    return isValidPosition(newX, newY, tetromino.block, grid);
}

export function moveTetromino(tetromino, direction) {
    switch(direction) {
        case UP:
            tetromino.x -= 1;
            break;
        case DOWN:
            tetromino.x += 1;
            break;
        case LEFT:
            tetromino.y -= 1;
            break;
        case RIGHT:
            tetromino.y += 1;
            break;
    }
}