const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
//whenever app is ready, create a new browser window
let addWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  //this will load the main.html inside the main browser window
  mainWindow.loadURL(`file://${__dirname}/main.html`);
 
  //whenever the main window is closed, the sub menu window is also closed

  mainWindow.on('closed', ()=>app.quit())
  //creating the menu bar of our desktop bar
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

//for creating a new window
function createAddWindow(){
addWindow = new BrowserWindow({
  width: 300,
  height:200,
  title: 'Add New Todo'
});
addWindow.loadURL(`file://${__dirname}/add.html`);

//we don't wan't the addWindow object to be still there as garbage and claim RAM's space
//on line 35, since the addWindow object triggers a close method
//but it still is there referencing the BrowserWindow class and we dont want that
addWindow.on('closed', ()=> addWindow = null);
}

function clearList(){
  //emitting an event on main window todo:clear
  mainWindow.webContents.send('todo:clear')
}


//listening message sent from html to this electron side of app
ipcMain.on('todo:add', (event, todo)=>{
mainWindow.webContents.send('todo:add', todo);
//closing the addWindow as soon as the user adds the field
addWindow.close();


})


//will contain an array of objects, needed to make the menu bar
//of our app, also the subMenu panel labels

//iun osx the first option in the menu bar, here file,
//is overlapped by the Electron home menu title
//to overcome this, an empty object is added to the menuTemplate array

//this only happens in OSX
const menuTemplate = [
    {},
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        click() {createAddWindow();}
      },
      {
        label: "Clear Todo",
        click() {clearList();}
      },
      {
        label: "Quit",
        //accelerator property adds shortcut key property to the submenu option
        accelerator: (()=>{
            //for ios
            if(process.platform === 'darwin'){
                return 'Command+Q'
                //for windows
            }else{
                return 'Ctrl+Q'
            }
        })(),
        //adding quit functionality to the quit submenu
        click(){
            app.quit();
        }
      }
    ]
  }
];


//checking for process platform on OSX, which is darwin
//basically trying to make the menu bar uniform 
//across both windows and OSX
if(process.platform === 'darwin'){
menuTemplate.unshift({});
}

//when we added the menu template , we removed the 
//default header bar and thereby lost the View option
//which had the dev tool option
//below we are trying to add that back so that we can open dev tools in dev environment
if(process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label: 'View',
    submenu: [
      //adding the option to reload
      {role: 'reload'},
      {
        label: 'Toggle Developer Tools',
        //adding shortcut/hot keys to open the menus
        accelerator: process.platform === 'darwin'?'Command+Alt+I':'Ctrl+Shift+I',
        //getting the correct specific dev tools for both the windows
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}