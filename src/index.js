import "./styles.css";

import { GameController } from "./controller.js";
import { GameModel } from "./model.js";
import { GameView } from "./view.js";

createBoard(20, 10, ".board-section");

function createBoard(rows, cols, selector){
    let board = document.querySelector(selector);
    
    for (let i = 0; i < rows*cols; i++) {
        let block = `<div class="block"></div>`
        board.innerHTML += block;
    }
}


let gameModel = new GameModel();
let gameView = new GameView();
let gameController = new GameController(gameModel, gameView);
//gameView.drawTetromino(gameModel.getTetromino(), gameModel.getGrid());

gameController.startGame();