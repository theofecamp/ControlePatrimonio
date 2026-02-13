let addButton = document.querySelector("#open-add-window-btn");
let isAdding = true;

addButton.addEventListener('click', () => {
    let addItemWindow = document.querySelector("#add-item-window");
    if (isAdding) {
        addItemWindow.style.display = 'inline-block';
        
        addButton.style.backgroundColor = "rgb(201, 0, 0)";
        addButton.textContent = "Cancelar";
    } else {
        addItemWindow.style.display = 'none';

        addButton.style.backgroundColor = "rgb(26, 184, 26)";
        addButton.textContent = "Adicionar";
    }

    isAdding = !isAdding;
})

let addItemButton = document.getElementById('add-item-btn');

addItemButton.addEventListener('click', async () => {
    const data = {
        id: document.getElementById('item-id').value,
        acquiringDate: document.getElementById('item-acquiring-date').value,
        nf: document.getElementById('item-nf-number').value,
        supplier: document.getElementById('item-supplier').value,
        description: document.getElementById('item-description').value,
        baseValue: document.getElementById('item-base-value').value
    }

    await window.fileAPI.writeFile(data);
    loadTable();
})

async function loadTable() {
    const rows = await window.fileAPI.readFile();
    const tbody = document.getElementById('table-body');

    tbody.innerHTML = "";

    rows.forEach(row => {
        let tr = document.createElement('tr');
        tr.classList.add("item-row");

        tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.acquiringDate}</td>
        <td>${row.nf}</td>
        <td>${row.supplier}</td>
        <td>${row.description}</td>
        <td>${row.baseValue}</td>
        <td><button id="write-off-btn" class="add-edit table-btns">Baixar</button></td>
        <td><button id="edit-row-btn" class="add-edit table-btns unactive">Editar</button></td>`;

        tbody.appendChild(tr);
    });
}

loadTable();

const tbody = document.getElementById('table-body');

tbody.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-edit'))
        editRow(e.target);
});


function editRow(button) {
    if (button.classList.contains('unactive')) {
        const currRow = button.closest('tr');
        const rowCells = currRow.children;

        const id = rowCells[0].textContent;
        const acquiringDate = rowCells[1].textContent;
        const nf = rowCells[2].textContent;
        const supplier = rowCells[3].textContent;
        const description = rowCells[4].textContent;
        const baseValue = rowCells[5].textContent;

        button.dataset.oldId = id;
        button.dataset.oldDescription = description;

        rowCells[0].innerHTML = `<input type="number" value="${id}">`
        rowCells[1].innerHTML = `<input type="date" value="${acquiringDate}">`
        rowCells[2].innerHTML = `<input type="number" value="${nf}">`
        rowCells[3].innerHTML = `<input type="text" value="${supplier}">`
        rowCells[4].innerHTML = `<input type="text" value="${description}">`
        rowCells[5].innerHTML = `<input type="number" value="${baseValue}">`

        button.textContent = 'Confirmar';
        button.classList.remove('unactive');
        button.classList.add('active');
    } else if (button.classList.contains('active')) {
        changeRow(button);
    }
    
}

async function changeRow(button) {
    const currRow = button.closest('tr');
    const rowCells = currRow.children;
    const inputs = currRow.querySelectorAll('input');
    
    const newData = {
        id: inputs[0].value,
        acquiringDate: inputs[1].value,
        nf: inputs[2].value,
        supplier: inputs[3].value,
        description: inputs[4].value,
        baseValue: inputs[5].value
    }

    rowCells[0].textContent = inputs[0].value;
    rowCells[1].textContent = inputs[1].value;
    rowCells[2].textContent = inputs[2].value;
    rowCells[3].textContent = inputs[3].value;
    rowCells[4].textContent = inputs[4].value;
    rowCells[5].textContent = inputs[5].value;

    button.textContent = 'Editar';
    button.classList.remove('active');
    button.classList.add('unactive');

    const oldId = button.dataset.oldId;
    const oldDescription = button.dataset.oldDescription;

    await window.fileAPI.editFile(oldId, oldDescription, newData);
}