import { KEY, DRAW, CLEAR } from "./model/constants";

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

        this.model.resetHoldId();
        this.model.resetSwap();
        //draw next block
        //draw held block
        this.drawGhostAndTetromino();

        this.model.updateLastMoveTime();
        this.updateDropTime();
    }

    updateDropTime(interval = 1000) {
        if (!this.dropInterval) {
            this.dropInterval = setInterval(() => {
                this.gameLoop();
            }, interval);
        }
    }

    stopDrop() {
        if(this.dropInterval) {
            clearInterval(this.dropInterval);
            this.lockInterval = null;
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

    handleMovement(movement) {
        if(!this.model.tryMove(movement)) return;
        if(movement !== 'DOWN')
            this.model.updateLastMoveTime()

        this.yerp(() => this.model.moveTetromino(movement));
    }

    handleRotation(rotation) {
        let result = this.model.getRotationResult(rotation);
        if(!result.rotatable) return;
        this.model.updateLastMoveTime()

        this.yerp(() => this.model.rotateTetromino(result));
    }

    handleHardDrop() {
        
        this.yerp(() => this.model.hardDrop());

        this.papasha();

        this.checkGameOver();
    }
    
    yerp(action) {
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostY(), CLEAR);
        action();
        this.drawGhostAndTetromino();
    }

    handleSwap() {
        if(this.model.isSwapped()) return;

        this.yerp(() => this.model.swapTetromino());
        
        //draw held item
        this.checkGameOver();
    }

    gameLoop() {
        if(this.model.tryMove('DOWN')){
            this.handleMovement('DOWN');
        } else if(this.model.hasMovedRecently() && this.model.getLevel < 19) {
            console.log("recently moved");
        } else {
            this.papasha();

            this.checkGameOver();
        }
    }

    papasha() {
        this.model.updateGrid();
        this.model.resetSwap();
        this.model.clearRows();
        this.view.updateScore(this.model.getScore());
        this.view.updateLevel(this.model.getLevel());
        this.updateDropTime();
        this.model.createTetromino();
        //Draw next block
    }

    checkGameOver() {
        if(this.model.isValidPosition()) {
            this.drawGhostAndTetromino();
        } else if(this.model.tryMove('UP')){
            this.model.moveTetromino('UP');
            this.drawGhostAndTetromino();
        } else {
            console.log("GAME OVER");
            this.model.moveTetromino('UP');
            this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getTetromino().y, DRAW);
            this.stopDrop(); 
        }
    }

    drawGhostAndTetromino() {
        this.model.findGhostPosition();
        this.view.drawTetromino(this.model.getTetromino(), this.model.getGrid(), this.model.getGhostY(), DRAW);
    }
}