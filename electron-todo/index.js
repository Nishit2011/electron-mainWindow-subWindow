const electron = require('electron');
const {app, BrowserWindow} = electron;

let mainWindow;
//whenever app is ready, create a new browser window
app.on('ready', ()=>{
    mainWindow =  new BrowserWindow({});
    //this will load the main.html inside the main browser window
    mainWindow.loadURL(`file://${__dirname}/main.html`)
})