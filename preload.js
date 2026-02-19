const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("fileAPI", {
    writeFile: (row) => ipcRenderer.invoke("writeFile", row),
    readFile: () => ipcRenderer.invoke("readFile"),
    editFile: (oldId, oldDescription, newData) => ipcRenderer.invoke("editFile", oldId, oldDescription, newData),
    openWriteOffWindow: () => ipcRenderer.invoke("openWriteOffWindow"),
    writeOff: (itemId, itemDescription, writeOffData) => ipcRenderer.invoke("writeOff", itemId, itemDescription, writeOffData)
});