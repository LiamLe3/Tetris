export function populateTable(rows, cols, selector){
    const table = document.querySelector(selector);
    table.innerHTML = "";

    const body = document.createElement("tbody");
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");
            row.append(cell);
        }

        body.appendChild(row);
    }
    
    table.appendChild(body);
}