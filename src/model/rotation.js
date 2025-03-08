import { 
        ORIENTATIONS, ORI, ROTATE,
        CLOCKWISE, SQUARE, LINE, 
        I_KICK_TABLE, OTHER_KICK_TABLE 
    } from './constants.js'

import { isValidPosition } from './helper.js';

// Get the resuts of attempting to rotate the tetromino
export function getRotationResult(tetromino, rotation, grid) {
    let rotatedBlock = rotateBlock(rotation, tetromino);
    let direction = getDirection(rotation);

    let { blockId, orientation } = tetromino;
    let endOrientation = (orientation + direction) % ORIENTATIONS;

    // Square block rotations result in the same block
    if(blockId === SQUARE)
        return { rotatable: false }

    let kickTestId;
    let kickTable;
    if(blockId === LINE) {
        kickTestId = getIBlockTests(orientation, endOrientation);
        kickTable = I_KICK_TABLE;
    } else {
        kickTestId = getOtherBlockTests(orientation, endOrientation);
        kickTable = OTHER_KICK_TABLE;
    }

    let result = runKickTests(kickTestId, tetromino, rotatedBlock, grid, kickTable);
    return { ...result, newOrientation: endOrientation }
}

// Makes the rotated block for testing
function rotateBlock(rotation, tetromino) {
    let rotatedBlock = JSON.parse(JSON.stringify(tetromino.block));
    transpose(rotatedBlock);
    reverse(rotation, rotatedBlock);
    return rotatedBlock;
}

// Transposes the block matrix
function transpose(block) {
    // Swap the elements across the diagonal
    for (let i = 0; i < block.length; i++)
        for (let j = 0; j < i; j++)
            [block[i][j], block[j][i]] = [block[j][i], block[i][j]];
}

// Reverses the block matrix by row or column
function reverse(rotation, block) {
    if(rotation === CLOCKWISE)
        block.forEach(row => row.reverse());
    else
        block.reverse();
}

// Gets the direction of the rotation
function getDirection(rotation) {
    return rotation === CLOCKWISE ? ROTATE.RIGHT : ROTATE.LEFT;
}

// Returns the test number for I blocks
function getIBlockTests(current, end){
    if(current === 0 && end === ORI.RIGHT)
        return 0;
    else if(current === ORI.RIGHT && end === ORI.START)
        return 1;
    else if(current === ORI.RIGHT && end === ORI.FLIP)
        return 2;
    else if(current === ORI.FLIP && end === ORI.RIGHT)
        return 3;
    else if(current === ORI.FLIP && end === ORI.LEFT)
        return 4;
    else if(current === ORI.LEFT && end === ORI.FLIP)
        return 5;
    else if(current === ORI.LEFT && end === ORI.START)
        return 6;
    else
        return 7;
}

// Returns the test number for all other blocks
function getOtherBlockTests(current, end) {
    if(current === ORI.LEFT)
        return 0;
    else if(current === ORI.RIGHT)
        return 1;
    else if(end === ORI.LEFT)
        return 2
    else
        return 3;
}

// Runs the kick test for the rotation type to see if the tetromino can rotate into a new position
function runKickTests(testId, tetromino, block, grid, kickTable){
    let result = { rotatable: false };

    kickTable[testId].some(test => {
        let newX = tetromino.x + test.x;
        let newY = tetromino.y - test.y; // '-' because positive Y is downwards
        if(isValidPosition(newX, newY, block, grid)) {
            result = {
                rotatable: true,
                rotatedBlock: block,
                x: newX,
                y: newY
            };

            return true;
        }

        return false;
    })

    return result;
}