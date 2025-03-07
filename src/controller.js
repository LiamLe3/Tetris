import { KEY, DRAW, CLEAR, MOVEMENT, LOCK_DELAY } from "./model/constants";

export class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.dropInterval = null;

        this.model.setDrawCellCallback((color, index) => {
            this.view.drawCell(color, index);
        })

        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }
    
    startGame() {
        this.model.createGrid();

        this.model.resetScore();
        this.view.updateScore(this.model.getScore());

        this.model.resetLinesCleared();

        this.model.updateLevel();
        this.view.updateLevel(this.model.getLevel());

        this.model.resetBag()
        this.model.getNextTetromino();
        this.model.createTetromino();

        this.model.resetActionCount();
        this.model.resetHoldId();
        this.model.resetSwap();
        
        this.view.displayHoldBlock(this.model.getHoldId());
        this.view.displayNextBlock(this.model.getNextId());
        this.drawGhostAndTetromino();

        this.model.updateLastMoveTime();
        this.updateDropInterval();
    }

    updateDropInterval() {
        if (!this.dropInterval) {
            this.dropInterval = setInterval(() => {
                this.gameLoop();
            }, this.model.getSpeed());
        }
    }

    stopDropInterval() {
        if(this.dropInterval) {
            clearInterval(this.dropInterval);
            this.dropInterval = null;
        }
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

    performAction(action) {
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostY(), CLEAR);
        action();
        this.drawGhostAndTetromino();
    }

    handleMovement(movement) {
        if(!this.model.tryMove(movement)) return;
        this.model.updateLastMoveTime()
        this.model.increaseActionCount();

        this.performAction(() => this.model.moveTetromino(movement));
    }

    handleRotation(rotation) {
        let result = this.model.getRotationResult(rotation);
        if(!result.rotatable) return;
        this.model.updateLastMoveTime()
        this.model.increaseActionCount();

        this.performAction(() => this.model.rotateTetromino(result));
    }

    handleHardDrop() {

        this.performAction(() => this.model.hardDrop());

        this.lockTetromino();

        this.checkGameOver();
    }

    handleSwap() {
        if(this.model.isSwapped()) return;

        this.performAction(() => this.model.swapTetromino());
        
        this.view.displayHoldBlock(this.model.getHoldId());
        this.checkGameOver();
    }

    gameLoop() {
        
        if(this.model.tryMove(MOVEMENT.DOWN)){
            this.performAction(() => this.model.moveTetromino(MOVEMENT.DOWN));
        } else if(this.model.hasMovedRecently() && this.model.getActionCount() <= 20) {
            this.stopDropInterval();
            if (!this.dropInterval) {
                this.dropInterval = setInterval(() => {
                    this.graceLoop();
                }, LOCK_DELAY);
            }
        } else {
            this.lockTetromino();
            this.checkGameOver();
        }
    }
    
    graceLoop() {
        if(this.model.tryMove(MOVEMENT.DOWN)) {
            this.performAction(() => this.model.moveTetromino(MOVEMENT.DOWN));
            this.stopDropInterval();
            this.updateDropInterval();
        } else if(!this.model.hasMovedRecently() || this.model.getActionCount() > 20) {
            this.stopDropInterval();
            this.updateDropInterval();
            this.lockTetromino();
            this.checkGameOver();
        }
    }

    lockTetromino() {
        this.model.updateGrid();
        this.model.resetSwap();
        this.model.clearRows();
        this.view.updateScore(this.model.getScore());
        this.view.updateLevel(this.model.getLevel());
        this.stopDropInterval();
        this.updateDropInterval();
        this.model.createTetromino();
        this.model.resetActionCount();
        this.view.displayNextBlock(this.model.getNextId());
    }

    checkGameOver() {
        if(this.model.isValidPosition()) {
            this.drawGhostAndTetromino();
        } else if(this.model.tryMove(MOVEMENT.UP)){
            this.model.moveTetromino(MOVEMENT.UP);
            this.drawGhostAndTetromino();
        } else {
            console.log("GAME OVER");
            this.model.moveTetromino(MOVEMENT.UP);
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getTetromino().y, DRAW);
            this.stopDropInterval(); 
        }
    }

    drawGhostAndTetromino() {
        this.model.findGhostPosition();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostY(), DRAW);
    }
}