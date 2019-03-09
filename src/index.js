const {app, BrowserWindow, Menu, shell, dialog, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
app.disableHardwareAcceleration();

let win;
let menu;
let winEdit;
let winShow;
let winColor;
var showcolor = [0,"#000000","#EFEFF0","#FFFFFF"];
var firstload = true;
const devmode = false;

function close() {
    console.log("close");
}
function mkmenu() {
    const version = app.getVersion();
    let menutmp = [{
        label: '文件',
        submenu: [{
            label: '退出',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.quit();
            }
        }]
    },{
        label: '计时器管理',
        submenu: [{
            label: '新建',
            accelerator: 'CmdOrCtrl+N',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 4);
            }
        },{
            type: 'separator'
        },{
            label: '当前选中计时器',
            enabled: false
        },{
            label: '放映',
            accelerator: 'CmdOrCtrl+D',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 0);
            }
        },{
            label: '编辑',
            accelerator: 'CmdOrCtrl+E',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 1);
            }
        },{
            label: '重置',
            accelerator: 'CmdOrCtrl+R',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 2);
            }
        },{
            label: '删除',
            accelerator: 'CmdOrCtrl+W',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 3);
            }
        },{
            type: 'separator'
        },{
            label: '所有计时器',
            enabled: false
        },{
            label: '全部删除',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 5);
            }
        }]
    },{
        label: '放映色彩',
        submenu: [{
            type: 'separator'
        },{
            label: '默认颜色',
            accelerator: 'CmdOrCtrl+Alt+D',
            click: (item,focusedWindow) => {
                showcolor = [0,"#000000","#EFEFF0","#FFFFFF"];
                if (focusedWindow && winShow) {
                    winShow.webContents.send('changeShowColor', showcolor);
                    win.webContents.send('changeShowColor', showcolor);
                }
            }
        },{
            label: '绿色(色度键)',
            accelerator: 'CmdOrCtrl+Alt+G',
            click: (item,focusedWindow) => {
                showcolor = [0,"#FFFFFF","#00FF00","#000000"];
                if (focusedWindow && winShow) {
                    winShow.webContents.send('changeShowColor', showcolor);
                    win.webContents.send('changeShowColor', showcolor);
                }
            }
        },{
            type: 'separator'
        },{
            label: '自定义数字色',
            accelerator: 'CmdOrCtrl+Alt+F',
            click: (item,focusedWindow) => {
                showcolor[0] = 1;
                createWindowColor(showcolor[1]);
            }
        },{
            label: '自定义背景色',
            accelerator: 'CmdOrCtrl+Alt+B',
            click: (item,focusedWindow) => {
                showcolor[0] = 2;
                createWindowColor(showcolor[2]);
            }
        },{
            label: '自定义数字描边色',
            accelerator: 'CmdOrCtrl+Alt+R',
            click: (item,focusedWindow) => {
                showcolor[0] = 3;
                createWindowColor(showcolor[3]);
            }
        }]
    },{
        label: '帮助',
        submenu: [{
            label: '调试工具',
            enabled: false
        },{
            label: '关闭子窗口',
            accelerator: 'CmdOrCtrl+Alt+Q',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(win => {
                            if (win.id > 1) win.close();
                        })
                    }
                }
            }
        },{
            label: '重新载入资源',
            accelerator: 'CmdOrCtrl+Alt+R',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.reload();
                }
            }
        },{
            label: '开发者工具',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        },{
            type: 'separator'
        },{
            label: '版本 '+version,
            enabled: false
        },{
            label: '主页',
            accelerator: 'F1',
            click: () => {
                shell.openExternal('https://github.com/kagurazakayashi/NyarukoTools_Timer');
            }
        },{
            label: '关于',
            click: function (item,focusedWindow) {
                if (focusedWindow) {
                    const options = {
                        type: 'info',
                        title: '关于',
                        buttons: ['继续'],
                        message: '直播用计时器工具，版本 '+version+'，神楽坂雅詩'
                    }
                    dialog.showMessageBox(focusedWindow,options,function(){});
                }
            }
        }]
    }]
    menu = Menu.buildFromTemplate(menutmp);
    Menu.setApplicationMenu(menu);
}
function createWindow () {
    mkmenu();
    win = new BrowserWindow({
        width: 800, 
        height: 600,
        title: '计时器',
        backgroundColor: '#EFEFF0',
        backgroundThrottling: false,
        webPreferences:{
            nodeIntegration: true
        }
    })
    win.setMenu(menu);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    if (devmode) win.webContents.openDevTools();
    win.webContents.on('did-finish-load', () => {
        if (firstload) {
            firstload = false;
            win.reload();
        } else {
            win.webContents.send('didFinishLoad',firstload);
        }
    });
    win.on('closed', () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.close();
        });
        win = null;
        app.quit();
    })
}
function createWindowShow(showdata) {
    if (winShow) {
        winShow.webContents.send('winshowinit', showdata);
        return;
    }
    winShow = new BrowserWindow({
        width: 800, 
        height: 300,
        backgroundColor: ('#'+showcolor[2]),
        title: 'NyarukoTools:Timer:Slide',
        backgroundThrottling: false,
        webPreferences:{
            nodeIntegration: true
        }
    })
    winShow.setMenu(null);
    winShow.loadURL(url.format({
        pathname: path.join(__dirname, 'show.html'),
        protocol: 'file:',
        slashes: true
    }))
    if (devmode) winShow.webContents.openDevTools();
    winShow.webContents.on('did-finish-load', () => {
        winShow.webContents.send('changeShowColor', showcolor);win.webContents.send('changeShowColor', showcolor);
        winShow.webContents.send('winshowinit', showdata);
    });
    winShow.on('closed', () => {
        ipcMain.removeAllListeners('closeWinShow');
        winShow = null;
    });
    ipcMain.on('closeWinShow', (event, arg) => {
        winShow.close();
    });
}
function createWindowColor(nowcolor) {
    winColor = new BrowserWindow({
        width: 580, 
        height: 350,
        backgroundColor: '#efefef',
        title: '选择颜色',
        parent: win,
        modal: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        webPreferences:{
            resizable: false,
            nodeIntegration: true
        }
    })
    winColor.setMenu(null);
    winColor.loadURL(url.format({
        pathname: path.join(__dirname, 'color.html'),
        protocol: 'file:',
        slashes: true
    }))
    if (devmode) winColor.webContents.openDevTools();
    winColor.webContents.on('did-finish-load', () => {
        winColor.webContents.send('wincolorinit', nowcolor);
    });
    winColor.on('closed', () => {
        ipcMain.removeAllListeners('closeWinColor');
        winColor = null;
    });
    ipcMain.on('closeWinColor', (event, arg) => {
        if (arg[0] == 1) {
            showcolor[showcolor[0]] = arg[1];
            if (winShow) {
                winShow.webContents.send('changeShowColor', showcolor);
                win.webContents.send('changeShowColor', showcolor);
            }
        }
        winColor.close();
    });
}
function createWindowEdit(editarg) {
    winEdit = new BrowserWindow({
        width: 420, 
        height: 250,
        backgroundColor: '#EFEFF0',
        title: '编辑计时器',
        parent: win,
        modal: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        webPreferences:{
            resizable: false,
            nodeIntegration: true
        }
    })
    winEdit.setMenu(null);
    winEdit.loadURL(url.format({
        pathname: path.join(__dirname, 'edit.html'),
        protocol: 'file:',
        slashes: true
    }));
    if (devmode) winEdit.webContents.openDevTools()
    winEdit.on('closed', () => {
        win.webContents.send('msgWinEdit', [0]);
        ipcMain.removeAllListeners('closeWinEdit');
        winEdit = null;
    });
    winEdit.webContents.on('did-finish-load', () => {
        winEdit.webContents.send('wineditinit', editarg);
    });
    ipcMain.on('closeWinEdit', (event, arg) => {
        win.webContents.send('msgWinEdit', arg);
        winEdit.close();
    });
}
//监听
ipcMain.on('openWinEdit', (event, arg) => {
    createWindowEdit(arg);
});
ipcMain.on('msgboxWinEdit', (event, arg) => {
    dialog.showMessageBox(winEdit,arg,function(){});
});
ipcMain.on('msgboxWin', (event, arg) => {
    dialog.showMessageBox(win,arg[0],function(index){
        win.webContents.send('informationDialogSelection', [1,index,arg[1]]);
    });
});
ipcMain.on('openWinShow', (event, arg) => {
    createWindowShow(arg);
});
ipcMain.on('openInfoMsgBox', (event, arg) => {
    dialog.showMessageBox(win,arg);
});
ipcMain.on('updateShowColor', (event, arg) => {
    showcolor = arg;
});
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
        app.quit();
    // }
});

app.on('activate', () => {
if (win === null) {
    createWindow();
}
});
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';