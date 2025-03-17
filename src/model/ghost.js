import { isValidPosition } from './helper.js';

/* Determines the ghost block (i.e. where and how it will 
land without any actions or when doing a hard drop) */
export function findGhostPosition(tetromino, grid) {
    let ghostY = tetromino.y;

    // Finds Y position of the ghost block
    while(isValidPosition(tetromino.x, ghostY, tetromino.block, grid)){
        ghostY++;
    }
    
    return ghostY - 1;
}