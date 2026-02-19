const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        width: 700,
        height: 400
    });

    mainWindow.loadURL(`File://${__dirname}/index.html`);
})

ipcMain.handle("openWriteOffWindow", () => {
    writeOffWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        width: 700,
        height: 460
    });

    writeOffWindow.loadURL(`File://${__dirname}/writeOffWindow.html`);
})

function readData() {
    if (!fs.existsSync("data.txt"))
        return [];

    let data = fs.readFileSync("data.txt", "utf-8");

    return data ? JSON.parse(data) : [];
}

ipcMain.handle("writeFile", (Event, row) => {
    let data = readData();
    data.push(row);
    fs.writeFileSync("data.txt", JSON.stringify(data, null, 2));
});

ipcMain.handle("readFile", () => {
    return readData();
});

ipcMain.handle("editFile", (Event, oldId, oldDescription, newData) => {
    let data = readData();

    data.forEach(row => {
        if (row.id == oldId && row.description == oldDescription) {
            row.id = newData.id;
            row.acquiringDate = newData.acquiringDate;
            row.nf = newData.nf;
            row.supplier = newData.supplier;
            row.description = newData.description;
            row.baseValue = newData.baseValue;
        }
    });

    fs.writeFileSync("data.txt", JSON.stringify(data, null, 2));
})

ipcMain.handle("writeOff", (Event, itemId, itemDescription, writeOffData) => {
    let data = readData();

    data.forEach(row => {
        if (row.id == itemId && row.description == itemDescription) {
            row.writtenOff = 1;
            row.writeOffDate = writeOffData.date;
            row.writeOffDescription = writeOffData.description;
        }
    });

    fs.writeFileSync("data.txt", JSON.stringify(data, null, 2));
})