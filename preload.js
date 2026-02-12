const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("fileAPI", {
    writeFile: (row) => ipcRenderer.invoke("writeFile", row),
    readFile: () => ipcRenderer.invoke("readFile")
});