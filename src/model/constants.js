/* Shared */
export const LOCK_DELAY = 500;
export const MAX_LEVEL = 20;
export const EMPTY = 0;

/* Controller Constants */
export const KEY = {
    CLOCK: 'ArrowUp', // Clockwise Rotation
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    SPACE: ' ',
    ANTI: 'z',
    STORE: 'c'
}

export const BUTTON = {
    ROTATE: 'btn-rotate',
    LEFT: 'btn-left',
    RIGHT: 'btn-right',
    DOWN: 'btn-down',
    DROP: 'btn-drop',
    STORE: 'btn-store',
    PLAY: 'btn-play',
    PAUSE: 'btn-pause',
    NEW_GAME: 'btn-new-game',
    HELP: 'btn-help'
}

export const GAME_STATE = {
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    END: 'END'
}
export const DRAW = 'DRAW';
export const CLEAR = 'CLEAR';

export const MAX_ACTION_COUNT = 20;

/* Model Contants */
// Other
export const SCORES = [0, 100, 300, 500, 800];
export const LINES_PER_LEVEL = 10;

// Board dimensions
export const HEIGHT = 20;
export const WIDTH = 10;

// Starting position
export const START_X = 3;
export const START_Y = 0;

// Movement
export const MOVEMENT = {
    UP: 'UP',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN'
}

// Rotations
export const ROTATE = {
    RIGHT: 1,
    LEFT: -1
}

export const ROTATION = {
    CLOCKWISE: 'CLOCKWISE',
    ANTI: 'ANTICLOCKWISE'
}

//Orientations
export const ORIENTATIONS = 4;

export const ORI = {
    START: 0,
    RIGHT: 1,
    FLIP: 2,
    LEFT: 3
}

// Kicktable --- '+' X is rightwards, '+' Y is upwards
export const I_KICK_TABLE = [
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: 1, y: 2}, {x: -2, y: -1}], //0->R
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -2}], //R->0
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}], //R->2
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: 1}, {x: 1, y: -1}], //2->R
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -1}], //2->L
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: 2}, {x: -2, y: -1}], //L->2
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: 1}, {x: 1, y: -2}], //L->0
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}]  //0->L
];

export const OTHER_KICK_TABLE = [
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}], // L->2 L->0 [Starts from L]
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}], // R->0 R->2 [Starts from R]
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}], // 2->L 0->L [Ends in L]
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}] // 0->R 2->R [Ends in R]       
];

// Colors
export const TRANSPARENT = 'transparent';

export const COLORS = [
    '#ffe600',
    '#04d9ff',
    '#cd07ff',
    '#0af61a',
    '#f70909',
    '#ff8809',
    '#094fff'
]

// Block types
export const SQUARE = 0;
export const LINE = 1;

// Blocks
export const BLOCK_ID = [ 0, 1, 2, 3, 4, 5, 6, 6 ];

const oBlock = [
    [1,1],
    [1,1]
]

const iBlock = [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
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

export const BLOCKS = [ oBlock, iBlock, tBlock, sBlock, zBlock, lBlock, jBlock ]