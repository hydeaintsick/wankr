const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const os = require("os");

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

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
    vibrancy: "under-window",
    visualEffectState: "active",
    backgroundColor: "#00000000",
    hasShadow: false,
    thickFrame: false,
  });

  mainWindow.loadFile("index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (process.argv.includes("--dev")) {
    mainWindow.webContents.openDevTools();
  }
}

// ---- IPC window controls ----
ipcMain.handle("minimize-window", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle("close-window", () => {
  if (mainWindow) mainWindow.close();
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

// ---- Activity simulation (reset idle timer) ----
ipcMain.handle("simulate-activity", () => {
  try {
    const platform = os.platform();

    if (platform === "win32") {
      // Windows: utilise l’API SetThreadExecutionState via PowerShell
      exec(
        'powershell.exe -Command "[void][System.Runtime.InteropServices.Marshal]::ReleaseComObject((Add-Type -MemberDefinition \\"[DllImport(\\"kernel32.dll\\", SetLastError=true)]public static extern uint SetThreadExecutionState(uint esFlags);\\" -Name Win32 -Namespace Native -PassThru)::SetThreadExecutionState(0x80000002))"',
        (err) => {
          if (err) console.error("Windows idle reset failed:", err);
          else console.log("Windows idle reset successful");
        }
      );
    } else if (platform === "darwin") {
      // macOS: simule une frappe clavier factice (F5)
      exec(
        "osascript -e 'tell application \"System Events\" to key code 96'", // 96 = F5
        (err) => {
          if (err) console.error("macOS idle reset failed:", err);
          else console.log("macOS idle reset successful");
        }
      );
    } else if (platform === "linux") {
      // Linux: nécessite `xdotool`
      exec("xdotool key Shift", (err) => {
        if (err) console.error("Linux idle reset failed:", err);
        else console.log("Linux idle reset successful");
      });
    }

    return true;
  } catch (error) {
    console.error("Error simulating activity:", error);
    return false;
  }
});

// ---- Get screen size ----
ipcMain.handle("get-screen-size", () => {
  try {
    const primaryDisplay = screen.getPrimaryDisplay();
    return {
      width: primaryDisplay.size.width,
      height: primaryDisplay.size.height,
    };
  } catch (error) {
    console.error("Error getting screen size:", error);
    return { width: 1920, height: 1080 };
  }
});

// ---- App lifecycle ----
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ---- Prevent multiple instances ----
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
