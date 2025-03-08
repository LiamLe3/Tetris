import { BLOCKS, COLORS, BLOCK_ID, SQUARE, START_X, START_Y } from "./constants";

// Returns a block in the bag, refreshes bag if it is empty
export function getNextTetromino(bag) {
    if(bag.length === 0){
        bag = generateNewBag(bag);
    }
    return bag.pop();
}

// Refills and randomises order in bag
function generateNewBag(bag) {
    bag.push(...BLOCK_ID);

    // Randomly swaps the order in which blocks are pulled out
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag
}

// Factory function for tetromino information
export function createTetromino(nextBlockId) {
    return {
        block: JSON.parse(JSON.stringify(BLOCKS[nextBlockId])),
        color: COLORS[nextBlockId],

        //Adjusts horizontal position for Square spawns
        x: nextBlockId === SQUARE ? START_X + 1 : START_X,

        y: START_Y,
        orientation: 0,
        blockId: nextBlockId
    }
}