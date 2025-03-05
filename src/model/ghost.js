import { isValidPosition } from './helper.js';

export function findGhostPosition(tetromino, grid) {
    let ghostY = tetromino.y;
    while(isValidPosition(tetromino.x, ghostY, tetromino.block, grid)){
        ghostY++;
    }
    
    return ghostY - 1;
}