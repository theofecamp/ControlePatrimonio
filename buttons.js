async function displayInfoCards() {
    let totalValueDisplay = document.getElementById('total-value');
    let totalValue = 0;

    let lostValueDisplay = document.getElementById('lost-value');
    let lostValue = 0;

    let currentValueDisplay = document.getElementById('current-value');
    let currentValue = 0;

    const data = await window.fileAPI.readFile();

    data.forEach(row => {
        console.log(totalValue);
        console.log(lostValue); 
        console.log(currentValue);

        totalValue += parseFloat(row.baseValue);

        if (row.writtenOff == 1)
            lostValue += parseFloat(row.baseValue);
        else
            currentValue += parseFloat(row.baseValue);
    });

    const totalValueBR = totalValue.toLocaleString('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    totalValueDisplay.innerHTML = `R$ ${totalValueBR}`;

    const lostValueBR = lostValue.toLocaleString('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    lostValueDisplay.innerHTML = `R$ ${lostValueBR}`;

    const currentValueBR = currentValue.toLocaleString('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    currentValueDisplay.innerHTML = `R$ ${currentValueBR}`;
}

document.addEventListener('DOMContentLoaded', displayInfoCards);

let addButton = document.querySelector("#open-add-window-btn");
let isAdding = true;

function openCloseAddItemTab() {
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
}

addButton.addEventListener('click', openCloseAddItemTab);

let addItemButton = document.getElementById('add-item-btn');

addItemButton.addEventListener('click', async () => {
    let itemId = document.getElementById('item-id').value;
    let itemAcquiringDate = document.getElementById('item-acquiring-date').value;
    let itemNfNumber = document.getElementById('item-nf-number').value;
    let itemSupplier = document.getElementById('item-supplier').value;
    let itemDescription = document.getElementById('item-description').value;
    let itemBaseValue = document.getElementById('item-base-value').value;

    const data = {
        id: itemId,
        acquiringDate: itemAcquiringDate,
        nf: itemNfNumber,
        supplier: itemSupplier,
        description: itemDescription,
        baseValue: itemBaseValue,
        writtenOff: 0,
        writeOffDate: "",
        writeOffDescription: ""
    }

    openCloseAddItemTab();

    await window.fileAPI.writeFile(data);
    loadTable();

    displayInfoCards();
})

async function loadTable() {
    const rows = await window.fileAPI.readFile();
    const tbody = document.getElementById('table-body');

    tbody.innerHTML = "";

    rows.forEach(row => {
        let tr = document.createElement('tr');
        tr.classList.add("item-row");
        tr.classList.add("in-use");

        tr.innerHTML = `
        <td id="row-id">${row.id}</td>
        <td>${row.acquiringDate}</td>
        <td>${row.nf}</td>
        <td>${row.supplier}</td>
        <td id="row-description">${row.description}</td>
        <td>${row.baseValue}</td>
        <td><button id="write-off-btn" class="add-edit table-btns">Baixar</button></td>
        <td><button id="edit-row-btn" class="add-edit table-btns unactive">Editar</button></td>`;

        tbody.appendChild(tr);

        let rowCells = tr.children;

        if (row.writtenOff == "1") {
            rowCells[6].querySelector('button').style.backgroundColor = "#f30909";
            rowCells[6].querySelector('button').innerHTML = "Baixado";
        }
    });
}

loadTable();

const tbody = document.getElementById('table-body');

tbody.addEventListener('click', function(e) {
    if (e.target.id == "edit-row-btn")
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
    } else if (button.classList.contains('active'))
        changeRow(button);
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

tbody.addEventListener('click', function(e) {
    if (e.target.id == "write-off-btn")
        openWriteOffWindow(e.target);
})

async function openWriteOffWindow(button) {
    const currRow = button.closest('tr');
    const rowCells = currRow.children

    const itemId = rowCells[0].textContent;
    const itemDescription = rowCells[4].textContent;

    localStorage.setItem("tempItemId", itemId);
    localStorage.setItem("tempItemDescription", itemDescription);

    await window.fileAPI.openWriteOffWindow();
}