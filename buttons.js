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
        tr = document.createElement('tr');
        tr.classList.add("item-row");

        tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.acquiringDate}</td>
        <td>${row.nf}</td>
        <td>${row.supplier}</td>
        <td>${row.description}</td>
        <td>${row.baseValue}</td>
        <td><button id="write-off-btn" class="add-edit table-btns">Baixar</button></td>
        <td><button id="edit-row-btn" class="add-edit table-btns">Editar</button></td>`;

        tbody.appendChild(tr);
    });
}

loadTable();