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

const INTERVAL = 1000;
export class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }
    
    startGame() {
        this.model.createTetromino();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid());
        setInterval(() => {this.gameLoop()}, 100);
    }

    stopGame() {
        clearInterval(this.gameInterval);
    }

    handleKeyPress(event) {
    
        event.preventDefault();
        const key = event.which;
    
        switch(key) {
            case KEY.UP:
                if(!this.model.tryMove('CLOCKWISE')) return;
                this.handleMovement('CLOCKWISE');
                break;
            case KEY.DOWN:
                if(!this.model.tryMove('DOWN')) return;
                this.handleMovement('DOWN');
                break;
            case KEY.LEFT:
                if(!this.model.tryMove('LEFT')) return;
                this.handleMovement('LEFT');
                break;
            case KEY.RIGHT:
                if(!this.model.tryMove('RIGHT')) return;
                this.handleMovement('RIGHT');
                break;
            case KEY.SPACE:
                console.log("space");
                break;
            case KEY.HELP:
                console.log("help");
                break;
            case KEY.C_ROTATE:
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

    handleMovement(movement) {
        this.view.clearTetromino(this.model.getTetromino(), this.model.getGrid());
        this.model.moveTetromino(movement);
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid());
    }

    gameLoop() {
        if(this.model.tryMove('DOWN')){
            this.handleMovement('DOWN');
        } else {
            this.model.updateGrid();
            this.model.createTetromino();
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid());
        }
    }
}