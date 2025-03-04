const BLOCK_ID = [ 0, 1, 2, 3, 4, 5, 6 ];
const SQUARE = 0;

const START_X = 0;
const START_Y = 3;


const oBlock = [
    [2,2],
    [2,2]
]

const iBlock = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

const tBlock = [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0]
]

const sBlock = [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0]
]

const zBlock = [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0]
]

const lBlock = [
    [0, 0, 6],
    [6, 6, 6],
    [0, 0, 0]
]

const jBlock = [
    [7, 0, 0],
    [7, 7, 7],
    [0, 0, 0]
]

const BLOCKS = [ oBlock, iBlock, tBlock, sBlock, zBlock, lBlock, jBlock ]

const COLORS = [
    '#c23616',
    '#0097e6',
    '#44bd32',
    '#e1b12c',
    '#8c7ae6',
    '#e84393',
    '#00cec9'
]

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
        x: START_X,

        //Adjusts position for Square spawns
        y: nextBlockId === SQUARE ? START_Y + 1 : START_Y,

        //for wall kicks, blocks that are not line or square have same behaviour
        orientation: 0,
        blockId: nextBlockId
    }
}