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
        height: 400,
    });

    mainWindow.loadURL(`File://${__dirname}/index.html`);
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