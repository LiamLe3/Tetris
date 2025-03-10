import { KEY, BUTTON, DRAW, CLEAR, MOVEMENT, ROTATION, LOCK_DELAY, MAX_ACTION_COUNT } from "./model/constants";

export class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.dropInterval = null;
        this.btns = document.querySelectorAll('[id*="btn-"');
        
        this.model.setDrawCellCallback((color, index) => {
            this.view.drawCell(color, index);
        })

        this.attachKeyEventListeners();
        this.attachButtonEventListeners();

    }

    /* Event Listeners */
    attachKeyEventListeners() {
        document.addEventListener('keydown', (event) => {
            event.preventDefault();
        
            switch(event.key) {
                case KEY.CLOCK:
                    this.handleRotation(ROTATION.CLOCKWISE);
                    break;
                case KEY.ANTI:
                    this.handleRotation(ROTATION.ANTI);
                    break;
                case KEY.DOWN:
                    this.handleMovement(MOVEMENT.DOWN);
                    break;
                case KEY.LEFT:
                    this.handleMovement(MOVEMENT.LEFT);
                    break;
                case KEY.RIGHT:
                    this.handleMovement(MOVEMENT.RIGHT);
                    break;
                case KEY.SPACE:
                    this.handleHardDrop();
                    break;
                case KEY.STORE:
                    this.handleSwap();
                    break;
            }
        
        })

    }

    attachButtonEventListeners() {
        this.btns.forEach(event => {
            let id = event.getAttribute('id');
            event.addEventListener('click', () => {
                switch (id) {
                    case BUTTON.ROTATE:
                        this.handleRotation(ROTATION.CLOCKWISE);
                        break;
                    case BUTTON.LEFT:
                        this.handleMovement(MOVEMENT.LEFT);
                        break;
                    case BUTTON.RIGHT:
                        this.handleMovement(MOVEMENT.RIGHT);
                        break;
                    case BUTTON.DOWN:
                        this.handleMovement(MOVEMENT.DOWN);
                        break;
                    case BUTTON.DROP:
                        this.handleHardDrop();
                        break;
                    case BUTTON.STORE:
                        this.handleSwap();
                        break;
                }
            })
        })
    }

    /* Game Start */
    startGame() {
        this.resetModel();
        this.resetView();
        this.updateDropInterval();
    }

    resetModel() {
        this.model.createGrid();

        this.model.resetScore();
        this.model.resetLinesCleared();
        this.model.updateLevel();

        this.model.resetBag()
        this.model.getNextTetromino();
        this.model.createTetromino();

        this.model.resetActionCount();
        this.model.resetHoldId();
        this.model.resetSwap();

        this.model.updateLastMoveTime();
    }

    resetView() {
        this.view.updateScore(this.model.getScore());
        this.view.updateLevel(this.model.getLevel());

        this.view.displayHoldBlock(this.model.getHoldId());
        this.view.displayNextBlock(this.model.getNextId());
        this.drawGhostAndTetromino();
    }

    /* Interval */
    updateDropInterval() {
        if (!this.dropInterval) {
            this.dropInterval = setInterval(() => this.gameLoop(), this.model.getSpeed());
        }
    }

    stopDropInterval() {
        if(this.dropInterval) {
            clearInterval(this.dropInterval);
            this.dropInterval = null;
        }
    }

    resetDropInterval() {
        this.updateDropInterval();
        this.stopDropInterval();
    }

    /* Actions */
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
        const result = this.model.getRotationResult(rotation);
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

    /* Gameplay Loop */
    gameLoop() {
        if(this.model.tryMove(MOVEMENT.DOWN)){
            this.performAction(() => this.model.moveTetromino(MOVEMENT.DOWN));
        } else if(this.model.hasMovedRecently() && this.model.getActionCount() <= MAX_ACTION_COUNT) {
            this.startGracePeriod();
        } else {
            this.lockTetromino();
            this.checkGameOver();
        }
    }
    
    startGracePeriod() {
        this.stopDropInterval();
        if (!this.dropInterval) {
            this.dropInterval = setInterval(() => this.gracePeriod(), LOCK_DELAY);
        }
    }

    gracePeriod() {
        if(this.model.tryMove(MOVEMENT.DOWN)) {
            this.performAction(() => this.model.moveTetromino(MOVEMENT.DOWN));
            this.resetDropInterval();
        } else if(!this.model.hasMovedRecently() || this.model.getActionCount() > MAX_ACTION_COUNT) {
            this.lockTetromino();
            this.checkGameOver();
        }
    }

    // Lock Tetromino
    lockTetromino() {
        this.model.updateGrid();
        this.model.clearRows();
        this.prepareNextTetromino();
        this.updateView();
    }

    prepareNextTetromino() {
        this.model.createTetromino();
        this.model.resetActionCount();
        this.model.resetSwap();
        this.resetDropInterval();
    }

    updateView() {
        this.view.updateScore(this.model.getScore());
        this.view.updateLevel(this.model.getLevel());
        this.view.displayNextBlock(this.model.getNextId());
    }

    checkGameOver() {
        if(this.model.isValidPosition()) {
            this.drawGhostAndTetromino();
        } else {
            this.model.moveTetromino(MOVEMENT.UP);

            if (this.model.tryMove(MOVEMENT.UP)){
                this.drawGhostAndTetromino();
            } else {
                console.log("GAME OVER");
                this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getTetromino().y, DRAW);
                this.stopDropInterval(); 
            }
        }
    }

    /* Other */
    drawGhostAndTetromino() {
        this.model.findGhostPosition();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostY(), DRAW);
    }
}
