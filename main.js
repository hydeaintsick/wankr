const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  // Get the primary display's work area
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Create the browser window with transparent settings
  mainWindow = new BrowserWindow({
    width: 400,
    height: 220,
    x: (width - 400) / 2,
    y: (height - 220) / 2,
    transparent: true,
    frame: false,
    resizable: false,
    minimizable: true,
    maximizable: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    },
    // Enable vibrancy/blur effects
    vibrancy: "under-window",
    visualEffectState: "active",
    // Additional transparency settings
    hasShadow: false,
    thickFrame: false,
  });

  // Load the index.html file
  mainWindow.loadFile("index.html");

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Enable DevTools in development
  if (process.argv.includes("--dev")) {
    mainWindow.webContents.openDevTools();
  }
}

// IPC handlers for window controls
ipcMain.handle("minimize-window", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("close-window", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle("toggle-always-on-top", () => {
  if (mainWindow) {
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    return !isAlwaysOnTop;
  }
  return false;
});

ipcMain.handle("get-window-state", () => {
  if (mainWindow) {
    return {
      isAlwaysOnTop: mainWindow.isAlwaysOnTop(),
      isMaximized: mainWindow.isMaximized(),
      isMinimized: mainWindow.isMinimized(),
    };
  }
  return null;
});

// Mouse movement simulation with simple key presses
ipcMain.handle("simulate-activity", () => {
  try {
    // Alternative: simulate scroll or key press activity
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.sendInputEvent({
        type: "keyDown",
        keyCode: "Shift",
      });

      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.sendInputEvent({
            type: "keyUp",
            keyCode: "Shift",
          });
        }
      }, 50);
    }
    return true;
  } catch (error) {
    console.error("Error simulating activity:", error);
    return false;
  }
});

// App event handlers
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
