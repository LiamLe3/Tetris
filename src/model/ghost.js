import { isValidPosition } from './helper.js';

export function findGhostPosition(tetromino, grid) {
    let ghostX = tetromino.x;
    while(isValidPosition(ghostX, tetromino.y, tetromino.block, grid)){
        ghostX++;
    }
    return ghostX - 1;
}