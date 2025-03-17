import "./styles.css";

import { GameController } from "./controller.js";
import { GameModel } from "./model.js";
import { GameView } from "./view.js";

let gameModel = new GameModel();
let gameView = new GameView();
let gameController = new GameController(gameModel, gameView);