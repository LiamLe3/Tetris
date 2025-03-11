import { KEY, BUTTON, GAME_STATE, DRAW, CLEAR, MOVEMENT, ROTATION, LOCK_DELAY, MAX_ACTION_COUNT } from "./model/constants";

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
                    this.rotateAction(ROTATION.CLOCKWISE);
                    break;
                case KEY.ANTI:
                    this.rotateAction(ROTATION.ANTI);
                    break;
                case KEY.DOWN:
                    this.moveAction(MOVEMENT.DOWN);
                    break;
                case KEY.LEFT:
                    this.moveAction(MOVEMENT.LEFT);
                    break;
                case KEY.RIGHT:
                    this.moveAction(MOVEMENT.RIGHT);
                    break;
                case KEY.SPACE:
                    this.hardDropAction();
                    break;
                case KEY.STORE:
                    this.swapAction();
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
                        this.rotateAction(ROTATION.CLOCKWISE);
                        break;
                    case BUTTON.LEFT:
                        this.moveAction(MOVEMENT.LEFT);
                        break;
                    case BUTTON.RIGHT:
                        this.moveAction(MOVEMENT.RIGHT);
                        break;
                    case BUTTON.DOWN:
                        this.moveAction(MOVEMENT.DOWN);
                        break;
                    case BUTTON.DROP:
                        this.hardDropAction();
                        break;
                    case BUTTON.STORE:
                        this.swapAction();
                        break;
                    case BUTTON.PLAY:
                        this.view.setGamePlay();
                        this.gameState = GAME_STATE.PLAY;
                        if(this.gameState === GAME_STATE.PAUSE){
                            
                        }
                        this.startGame()
                        break;
                    case BUTTON.PAUSE:
                        this.gameState = GAME_STATE.PAUSE;
                        this.view.displayPause();
                        break;
                }
            })
        })
    }

    /* Game Start */
    startGame() {
        this.model.resetModel();
        this.view.resetView(this.model.getScore(), this.model.getLevel(), this.model.getHoldId(), this.model.getNextId());
        this.drawGhostAndTetromino();
        this.updateDropInterval();
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
        this.stopDropInterval();
        this.updateDropInterval();
    }

    /* Actions */
    performAction(action) {
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostY(), CLEAR);
        action();
        this.drawGhostAndTetromino();
    }

    moveAction(movement) {
        if(!this.model.tryMove(movement)) return;
        this.model.updateLastMoveTime()
        this.model.increaseActionCount();

        this.performAction(() => this.model.moveTetromino(movement));
    }

    rotateAction(rotation) {
        const result = this.model.getRotationResult(rotation);
        if(!result.rotatable) return;
        this.model.updateLastMoveTime()
        this.model.increaseActionCount();

        this.performAction(() => this.model.rotateTetromino(result));
    }

    hardDropAction() {
        this.performAction(() => this.model.hardDrop());
        this.lockTetromino();
        this.checkGameOver();
    }

    swapAction() {
        if(this.model.isSwapped()) return;
        this.performAction(() => this.model.swapTetromino());
        this.view.displayHoldBlock(this.model.getHoldId());
        this.checkGameOver();
    }

    /* Gameplay Loop */
    gameLoop() {
        if(this.gameState === GAME_STATE.PLAY){
            if(this.model.tryMove(MOVEMENT.DOWN)){
                this.performAction(() => this.model.moveTetromino(MOVEMENT.DOWN));
            } else if(this.model.hasMovedRecently() && this.model.getActionCount() <= MAX_ACTION_COUNT) {
                this.startGracePeriod();
            } else {
                this.lockTetromino();
                this.checkGameOver();
            }
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

    /* Game Over */
    checkGameOver() {
        if(this.model.isValidPosition()) {
            this.drawGhostAndTetromino();
        } else {
            this.model.moveTetromino(MOVEMENT.UP);

            if (this.model.tryMove(MOVEMENT.UP)){
                this.drawGhostAndTetromino();
            } else {
                this.gameState = GAME_STATE.END;
                this.stopDropInterval();
                this.view.displayGameOver();
            }
        }
    }



    /* Other */
    lockTetromino() {
        this.model.updateGrid();
        this.model.clearRows();
        this.model.prepareNextTetromino();
        this.resetDropInterval();
        this.view.updateView(this.model.getScore(), this.model.getLevel(), this.model.getNextId());
    }

    drawGhostAndTetromino() {
        this.model.findGhostPosition();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostY(), DRAW);
    }
}
