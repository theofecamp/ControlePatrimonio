const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("fileAPI", {
    writeFile: (row) => ipcRenderer.invoke("writeFile", row),
    readFile: () => ipcRenderer.invoke("readFile"),
    editFile: (oldId, oldDescription, newData) => ipcRenderer.invoke("editFile", oldId, oldDescription, newData)
});