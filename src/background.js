'use strict'
import path from 'path'
import { app, protocol, BrowserWindow, Menu, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray
let icon
let menuTemplate = []

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'B-redpacket-helper', privileges: { secure: true, standard: true } }
])

function makeTray() {
  if (tray !== undefined)
    tray.destroy()
  icon = path.join(__static, 'favicon.ico')
  tray = new Tray(icon)
  tray.on('click', () => {
    win.show()
  });
  if (win.isVisible()) {
    menuTemplate = ([
      {
        label: '隐藏主界面', click: () => {
          win.hide()
          makeTray()
        }
      },
      { label: '退出', click: () => app.exit() }])
  }
  else {
    menuTemplate = ([
      {
        label: '显示主界面', click: () => {
          win.show()
          makeTray()
        }
      },
      { label: '退出', click: () => app.exit() }])
  }
  const contextMenu = Menu.buildFromTemplate(menuTemplate)
  tray.setToolTip('B-LIVE-HELPER')
  tray.setContextMenu(contextMenu)
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 860,
    height: 800,
    resizable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule: true,
      webviewTag: true,
      webSecurity: false
    },
    icon: path.join(__static, 'favicon.ico')
  })

  Menu.setApplicationMenu(null)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  /*makeTray()
  win.on('close', (e) => {
    e.preventDefault()
    win.hide()
    win.setSkipTaskbar(true)
    makeTray()
  })*/
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
