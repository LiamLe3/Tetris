const KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    C_ROTATE: 67,
    HELP: 72, //H-key
    PAUSE: 80, //P-key
    STORE: 83, //S-key
    TOGGLE: 84, //T-key
}

export function handleKeyPress (event) {

    event.preventDefault();
    let key = event.which;

    switch(key) {
        case KEY.UP:
            console.log("up");
            break;
        case KEY.DOWN:
            console.log("down");
            break;
        case KEY.LEFT:
            console.log("left");
            break;
        case KEY.RIGHT:
            console.log("right");
            break;
        case KEY.SPACE:
            console.log("space");
            break;
        case KEY.HELP:
            console.log("help");
            break;
        case KEY.HELP:
            console.log("counter-rotate");
            break;
        case KEY.PAUSE:
            console.log("pause");
            break;
        case KEY.STORE:
            console.log("store");
            break;
        case KEY.TOGGLE:
            console.log("toggle");
            break;
        
    }
}