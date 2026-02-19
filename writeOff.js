let itemId = localStorage.getItem("tempItemId");
let itemDescription = localStorage.getItem("tempItemDescription");

document.addEventListener('DOMContentLoaded', async () => {
    let writeOffDate = document.getElementById('write-off-date');
    let writeOffDescription = document.getElementById('write-off-description');

    const data = await window.fileAPI.readFile();

    data.forEach(row => {
        if (row.id == itemId && row.description == itemDescription) {
            writeOffDate.value = row.writeOffDate;
            writeOffDescription.value = row.writeOffDescription
        }
    });
})

const confirmWriteOffButton = document.getElementById('confirm-write-off');

confirmWriteOffButton.addEventListener('click', async () => {
    let writeOffDate = document.getElementById('write-off-date');
    let writeOffDescription = document.getElementById('write-off-description');

    const writeOffData = {
        date: writeOffDate.value,
        description: writeOffDescription.value
    }
    
    await window.fileAPI.writeOff(itemId, itemDescription, writeOffData);

    writeOffDate.textContent = '';
    writeOffDescription.textContent = '';

    window.close();
});