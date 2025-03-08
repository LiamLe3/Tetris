import { MOVEMENT } from './constants.js';
import { isValidPosition } from './helper.js';

// Checks if tetromino can move into given direction
export function tryMove(tetromino, movement, grid) {
    let newX = tetromino.x;
    let newY = tetromino.y;

    switch(movement) {
        case MOVEMENT.UP:
            newY -= 1;
            break;
        case MOVEMENT.DOWN:
            newY += 1;
            break;
        case MOVEMENT.LEFT:
            newX -= 1;
            break;
        case MOVEMENT.RIGHT:
            newX += 1;
            break;
    }

    return isValidPosition(newX, newY, tetromino.block, grid);
}

// Moves the tetromino in given direction
export function moveTetromino(tetromino, direction) {
    switch(direction) {
        case MOVEMENT.UP:
            tetromino.y -= 1;
            break;
        case MOVEMENT.DOWN:
            tetromino.y += 1;
            break;
        case MOVEMENT.LEFT:
            tetromino.x -= 1;
            break;
        case MOVEMENT.RIGHT:
            tetromino.x += 1;
            break;  
    }
}