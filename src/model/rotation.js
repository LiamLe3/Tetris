const CLOCKWISE = 'CLOCKWISE';

const ORIENTATIONS = 4;
const START_O = 0;
const RIGHT_O = 1;
const FLIP_O = 2;
const LEFT_O = 3;

const ROTATE_RIGHT = 1;
const ROTATE_LEFT = -1;

const SQUARE = 0;
const LINE = 1;

const iKickTable = [
    [{x: 0, y: 0}, {x: 0, y: -2}, {x: 0, y: 1}, {x: 2, y: 1}, {x: -1, y: -2}], //0->R
    [{x: 0, y: 0}, {x: 0, y: 2}, {x: 0, y: -1}, {x: 1, y: 2}, {x: -2, y: -1}], //R->0
    [{x: 0, y: 0}, {x: 0, y: -1}, {x: 0, y: 2}, {x: 2, y: -1}, {x: -1, y: 2}], //R->2
    [{x: 0, y: 0}, {x: 0, y: -2}, {x: 0, y: 1}, {x: 1, y: -2}, {x: -1, y: 1}], //2->R
    [{x: 0, y: 0}, {x: 0, y: 2}, {x: 0, y: -1}, {x: 1, y: 2}, {x: -1, y: -1}], //2->L
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: -2}, {x: 2, y: 1}, {x: -1, y: -2}], //L->2
    [{x: 0, y: 0}, {x: 0, y: -2}, {x: 0, y: 1}, {x: 1, y: -2}, {x: -2, y: 1}], //L->0
    [{x: 0, y: 0}, {x: 0, y: 2}, {x: 0, y: -1}, {x: 2, y: -1}, {x: -1, y: 2}]  //0->L
];

const otherKickTable = [
    [{x: 0, y: 0}, {x: 0, y: -1}, {x: -1, y: -1}, {x: 2, y: 0}, {x: 2, y: -1}], // L->2 L->0 [Starts from L]
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}, {x: 2, y: 0}, {x: 2, y: 1}], // R->0 R->2 [Starts from R]
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: -2, y: 0}, {x: -2, y: 1}], // 2->L 0->L [Ends in L]
    [{x: 0, y: 0}, {x: 0, y: -1}, {x: 1, y: -1}, {x: -2, y: 0}, {x: -2, y: -1}] // 0->R 2->R [Ends in R]       
];

import { isValidPosition } from './helper.js';

export function getRotationResult(tetromino, rotation, grid) {
    let rotatedBlock = rotateBlock(rotation, tetromino);
    let direction = getDirection(rotation);

    let { blockId, orientation } = tetromino;
    let endOrientation = (orientation + direction) % ORIENTATIONS;

    if(blockId === SQUARE)
        return { rotatable: false }

    let kickTestId;
    let kickTable;
    if(blockId === LINE) {
        kickTestId = getIBlockTests(orientation, endOrientation);
        kickTable = iKickTable;
    } else {
        kickTestId = getOtherBlockTests(orientation, endOrientation);
        kickTable = otherKickTable;
    }
    let result = runKickTests(kickTestId, tetromino, rotatedBlock, grid, kickTable);
    return { ...result, newOrientation: endOrientation }
}

function rotateBlock(rotation, tetromino) {
    let rotatedBlock = JSON.parse(JSON.stringify(tetromino.block));
    transpose(rotatedBlock);
    reverse(rotation, rotatedBlock);
    return rotatedBlock;
}

function transpose(block) {
    // Swap the elements across the diagonal
    for (let i = 0; i < block.length; i++)
        for (let j = 0; j < i; j++)
            [block[i][j], block[j][i]] = [block[j][i], block[i][j]];
}

function reverse(rotation, block) {
    if(rotation === CLOCKWISE)
        block.forEach(row => row.reverse());
    else
        block.reverse();
}
function getDirection(rotation) {
    return rotation === CLOCKWISE ? ROTATE_RIGHT : ROTATE_LEFT;
}

function getIBlockTests(current, end){
    if(current === 0 && end === RIGHT_O)
        return 0;
    else if(current === RIGHT_O && end === START_O)
        return 1;
    else if(current === RIGHT_O && end === FLIP_O)
        return 2;
    else if(current === FLIP_O && end === RIGHT_O)
        return 3;
    else if(current === FLIP_O && end === LEFT_O)
        return 4;
    else if(current === LEFT_O && end === FLIP_O)
        return 5;
    else if(current === LEFT_O && end === START_O)
        return 6;
    else
        return 7;
}

function getOtherBlockTests(current, end) {
    if(current === LEFT_O)
        return 0;
    else if(current === RIGHT_O)
        return 1;
    else if(end === LEFT_O)
        return 2
    else
        return 3;
}

function runKickTests(testId, tetromino, block, grid, kickTable){
    let result = { rotatable: false };

    kickTable[testId].some(test => {
        let newX = tetromino.x + test.x;
        let newY = tetromino.y + test.y;
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