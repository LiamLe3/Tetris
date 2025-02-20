import "./styles.css";

import { createBoard } from "./setup.js"

createBoard(20, 10, ".board-section");

let field = document.getElementsByClassName('block');
console.log(field);