import "./styles.css";

import { createBoard } from "./setup.js"

import { handleKeyPress } from "./controller.js"

createBoard(20, 10, ".board-section");

let field = document.getElementsByClassName('block');
console.log(field);

document.addEventListener('keydown', handleKeyPress)

