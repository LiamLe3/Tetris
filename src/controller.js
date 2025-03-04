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

const INTERVAL = 2000;
export class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.gameInterval = null;

        this.model.setDrawCellCallback((color, index) => {
            this.view.drawCell(color, index);
        })

        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }
    
    startGame() {
        this.model.createGrid(20, 10);
        this.model.setBag()
        this.model.getNextTetromino();
        this.model.createTetromino();
        this.model.findGhostPosition();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        this.gameInterval = setInterval(() => {this.gameLoop()}, INTERVAL);
    }

    stopGame() {
        clearInterval(this.gameInterval);
    }

    handleKeyPress(event) {
    
        event.preventDefault();
        const key = event.which;
    
        switch(key) {
            case KEY.UP:
                this.handleRotation('CLOCKWISE');
                break;
            case KEY.DOWN:
                this.handleMovement('DOWN');
                break;
            case KEY.LEFT:
                this.handleMovement('LEFT');
                break;
            case KEY.RIGHT:
                this.handleMovement('RIGHT');
                break;
            case KEY.SPACE:
                this.handleHardDrop();
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
                this.handleSwap();
                break;
            case KEY.TOGGLE:
                console.log("toggle");
                break;
        }

    }

    handleMovement(movement) {
        if(!this.model.tryMove(movement)) return;
        this.view.clearTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        this.model.moveTetromino(movement);
        this.model.findGhostPosition();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
    }

    handleRotation(rotation) {
        let result = this.model.getRotationResult(rotation);
        if(!result.rotatable) return;
        this.view.clearTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        this.model.rotateTetromino(result);
        this.model.findGhostPosition();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
    }

    handleHardDrop() {
        this.view.clearTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        this.model.hardDrop();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());

        this.model.updateGrid();
        this.model.checkRows();
        this.model.createTetromino();
        this.model.refreshSwap();

        if(this.model.isValidPosition()) {
            this.model.findGhostPosition();
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        } else if(this.model.tryMove('UP')){
            console.log("hey");
            this.model.moveTetromino('UP');
            this.model.findGhostPosition();
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        } else {
            console.log("GAME OVER");
            this.model.moveTetromino('UP');
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
            this.stopGame();
        }
    }
    
    handleSwap() {
        if(this.model.getSwapped()) return;

        this.view.clearTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        this.model.swapTetromino();
        //draw held item
        if(this.model.isValidPosition()) {
            this.model.findGhostPosition();
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        } else if(this.model.tryMove('UP')){
            this.model.moveTetromino('UP');
            this.model.findGhostPosition();
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
        } else {
            console.log("GAME OVER");
            this.model.moveTetromino('UP');
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
            this.stopGame();
        }
    }

    gameLoop() {
        if(this.model.tryMove('DOWN')){
            this.handleMovement('DOWN');
        } else {
            this.model.updateGrid();
            this.model.refreshSwap();
            this.model.checkRows();
            this.model.createTetromino();

            if(this.model.isValidPosition()) {
                this.model.findGhostPosition();
                this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
            } else if(this.model.tryMove('UP')){
                this.model.moveTetromino('UP');
                this.model.findGhostPosition();
                this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
            } else {
                console.log("GAME OVER");
                this.model.moveTetromino('UP');
                this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostX());
                this.stopGame();
            }
            
        }
    }
}