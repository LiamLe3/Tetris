import { BLOCKS, COLORS, BLOCK_ID, SQUARE, START_X, START_Y } from "./constants";

export function getNextTetromino(bag) {
    if(bag.length === 0){
        bag = generateNewBag(bag);
    }
    return bag.pop();
}

function generateNewBag(bag) {
    bag.push(...BLOCK_ID);
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag
}

export function createTetromino(nextBlockId) {
    return {
        block: JSON.parse(JSON.stringify(BLOCKS[nextBlockId])),
        color: COLORS[nextBlockId],
        x: nextBlockId === SQUARE ? START_X + 1 : START_X,

        //Adjusts position for Square spawns
        y: START_Y,

        //for wall kicks, blocks that are not line or square have same behaviour
        orientation: 0,
        blockId: nextBlockId
    }
}