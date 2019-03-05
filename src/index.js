const {app, BrowserWindow, Menu, shell, dialog, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
app.disableHardwareAcceleration()
app.setAppUserModelId("org.yashi.timer")

// 將這個 window 物件記在全域變數裡。
// 如果沒這麼做，這個視窗在 JavaScript 物件被垃圾回收時（GC）後就會被自動關閉。
let win
let menu
let winEdit
let winShow

function close() {
    console.log("EEEEE");
}
function mkmenu() {
    const version = app.getVersion();
    let menutmp = [{
        label: '文件',
        submenu: [{
            label: '退出',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.quit()
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
                if (focusedWindow) win.webContents.send('indexmenu', 50);
            }
        },{
            type: 'separator'
        },{
            label: '一般颜色',
            enabled: false
        },{
            label: '白色',
            accelerator: 'CmdOrCtrl+Alt+W',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 51);
            }
        },{
            label: '灰色',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 52);
            }
        },{
            label: '天蓝',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 53);
            }
        },{
            label: '粉色',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 54);
            }
        },{
            type: 'separator'
        },{
            label: '色度键支持',
            enabled: false
        },{
            label: '绿色',
            accelerator: 'CmdOrCtrl+Alt+G',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 55);
            }
        },{
            label: '蓝色',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 56);
            }
        },{
            label: '红色',
            click: (item,focusedWindow) => {
                if (focusedWindow) win.webContents.send('indexmenu', 57);
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
                            if (win.id > 1) win.close()
                        })
                    }
                }
            }
        },{
            label: '重新载入资源',
            accelerator: 'CmdOrCtrl+Alt+R',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.reload()
                }
            }
        },{
            label: '开发者工具',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools()
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
                shell.openExternal('https://github.com/kagurazakayashi/NyarukoTools/tree/master/NyarukoTimer')
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
                    dialog.showMessageBox(focusedWindow,options,function(){})
                }
            }
        }]
    }]
    menu = Menu.buildFromTemplate(menutmp)
}
function createWindow () {
    mkmenu()

    // 建立瀏覽器視窗。
    win = new BrowserWindow({
        width: 1200, 
        height: 600,
        title: '计时器',
        backgroundColor: '#EFEFF0',
        backgroundThrottling: false,
        webPreferences:{
            nodeIntegration: true
        }
    })
    win.setMenu(menu)

    // 並載入應用程式的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // 打開 DevTools。
    win.webContents.openDevTools()

    // 視窗關閉時會觸發。
    win.on('closed', () => {
        // 拿掉 window 物件的參照。如果你的應用程式支援多個視窗，
        // 你可能會將它們存成陣列，現在該是時候清除相關的物件了。
        win = null
    })
}
function createWindowShow() {
    winShow = new BrowserWindow({
        width: 800, 
        height: 600,
        backgroundColor: '#00FF00',
        title: '展示画面',
        backgroundThrottling: false,
        webPreferences:{
            nodeIntegration: true
        }
    })
    winShow.setMenu(menu)
    winShow.loadURL(url.format({
        pathname: path.join(__dirname, 'show.html'),
        protocol: 'file:',
        slashes: true
    }))
    winShow.webContents.openDevTools()
    winShow.on('closed', () => {
        winShow = null
    })
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
    winEdit.setMenu(null)
    winEdit.loadURL(url.format({
        pathname: path.join(__dirname, 'edit.html'),
        protocol: 'file:',
        slashes: true
    }))
    // winEdit.webContents.openDevTools()
    winEdit.on('closed', () => {
        win.webContents.send('msgWinEdit', [0]);
        ipcMain.removeAllListeners('closeWinEdit')
        winEdit = null
    })
    winEdit.webContents.on('did-finish-load', () => {
        winEdit.webContents.send('wineditinit', editarg)
    })
    ipcMain.on('closeWinEdit', (event, arg) => {
        win.webContents.send('msgWinEdit', arg)
        winEdit.close()
    })
}
//监听
ipcMain.on('openWinEdit', (event, arg) => {
    createWindowEdit(arg)
})
ipcMain.on('msgboxWinEdit', (event, arg) => {
    dialog.showMessageBox(winEdit,arg,function(){})
})
ipcMain.on('msgboxWin', (event, arg) => {
    dialog.showMessageBox(win,arg[0],function(index){
        win.webContents.send('informationDialogSelection', [1,index,arg[1]]);
    })
})
// 當 Electron 完成初始化，並且準備好建立瀏覽器視窗時
// 會呼叫這的方法
// 有些 API 只能在這個事件發生後才能用。
app.on('ready', createWindow)

// 在所有視窗都關閉時結束程式。
app.on('window-all-closed', () => {
// 在 macOS 中，一般會讓應用程式及選單列繼續留著，
// 除非使用者按了 Cmd + Q 確定終止它們
if (process.platform !== 'darwin') {
    app.quit()
}
})

app.on('activate', () => {
// 在 macOS 中，一般會在使用者按了 Dock 圖示
// 且沒有其他視窗開啟的情況下，
// 重新在應用程式裡建立視窗。
if (win === null) {
    createWindow()
}
})
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// 你可以在這個檔案中繼續寫應用程式主程序要執行的程式碼。 
// 你也可以將它們放在別的檔案裡，再由這裡 require 進來。