const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

// DOM elements
const minimizeBtn = document.getElementById("minimize-btn");
const closeBtn = document.getElementById("close-btn");
const alwaysOnTopBtn = document.getElementById("always-on-top-btn");
const toggleBlurBtn = document.getElementById("toggle-blur-btn");
const changeOpacityBtn = document.getElementById("change-opacity-btn");
const toggleTransparentZoneBtn = document.getElementById(
  "toggle-transparent-zone-btn"
);
const startStopBtn = document.getElementById("start-stop-btn");
const currentTimerDisplay = document.getElementById("current-timer");
const todaySessionsDisplay = document.getElementById("today-sessions");
const todayTimeDisplay = document.getElementById("today-time");
const totalTimeShortDisplay = document.getElementById("total-time-short");
const appContainer = document.querySelector(".app-container");
const transparentZone = document.querySelector(".transparent-zone");

// State variables
let blurLevel = 0; // 0: normal, 1: light, 2: heavy, 3: off
let opacityLevel = 0; // 0: normal, 1: 50%, 2: 75%, 3: 100%
let isAlwaysOnTop = false;
let transparentZoneVisible = true;

// Timer state
let isRunning = false;
let startTime = null;
let currentSessionTime = 0;
let todaySessions = 0;
let todayTime = 0;
let totalTime = 0;
let timerInterval = null;
let mouseInterval = null;

// Data file path
const dataPath = path.join(__dirname, "timer-data.json");

// Activity simulation functions
function startActivitySimulation() {
  console.log("startActivitySimulation called");
  if (mouseInterval) {
    clearInterval(mouseInterval);
  }

  mouseInterval = setInterval(async () => {
    if (isRunning) {
      console.log("Simulating activity...");
      try {
        await ipcRenderer.invoke("simulate-activity");
        console.log("Activity simulated successfully");
      } catch (error) {
        console.error("Error simulating activity:", error);
      }
    }
  }, 30000); // Every 30 seconds
  console.log("Activity simulation interval set");
}

function stopActivitySimulation() {
  if (mouseInterval) {
    clearInterval(mouseInterval);
    mouseInterval = null;
  }
}

// Initialize the app
async function initializeApp() {
  try {
    const windowState = await ipcRenderer.invoke("get-window-state");
    if (windowState) {
      isAlwaysOnTop = windowState.isAlwaysOnTop;
      updateAlwaysOnTopStatus();
      updateWindowState(windowState);
    }

    // Load saved data
    loadTimerData();

    // Update displays
    updateTimerDisplay();
    updateStatsDisplay();
    updateTotalTimeShortDisplay();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

// Timer functions
function startTimer() {
  console.log("startTimer called");
  if (!isRunning) {
    console.log("Timer not running, starting...");
    isRunning = true;
    startTime = Date.now();
    startStopBtn.classList.add("running");
    startStopBtn.querySelector(".btn-icon").textContent = "⏸️";

    timerInterval = setInterval(() => {
      updateTimerDisplay();
    }, 1000);

    // Start activity simulation for fake activity
    console.log("Starting activity simulation...");
    try {
      startActivitySimulation();
      console.log("Activity simulation started successfully");
    } catch (error) {
      console.error("Error starting activity simulation:", error);
    }
  } else {
    console.log("Timer already running");
  }
}

function stopTimer() {
  if (isRunning) {
    isRunning = false;
    const sessionTime = Math.floor((Date.now() - startTime) / 1000);
    currentSessionTime += sessionTime;
    todayTime += sessionTime;
    todaySessions++;
    totalTime += sessionTime;

    startStopBtn.classList.remove("running");
    startStopBtn.querySelector(".btn-icon").textContent = "▶️";

    clearInterval(timerInterval);
    timerInterval = null;

    // Stop activity simulation
    stopActivitySimulation();

    // Save data
    saveTimerData();

    // Update displays
    updateStatsDisplay();
    updateTotalTimeShortDisplay();
  }
}

function updateTimerDisplay() {
  if (isRunning) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const totalSeconds = currentSessionTime + elapsed;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    currentTimerDisplay.textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    const hours = Math.floor(currentSessionTime / 3600);
    const minutes = Math.floor((currentSessionTime % 3600) / 60);
    const seconds = currentSessionTime % 60;

    currentTimerDisplay.textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

function updateStatsDisplay() {
  todaySessionsDisplay.textContent = todaySessions;

  const hours = Math.floor(todayTime / 3600);
  const minutes = Math.floor((todayTime % 3600) / 60);

  todayTimeDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function updateTotalTimeShortDisplay() {
  const days = Math.floor(totalTime / 86400);
  const hours = Math.floor((totalTime % 86400) / 3600);

  totalTimeShortDisplay.textContent = `${days}d ${hours}h`;
}

// Data persistence
function saveTimerData() {
  const data = {
    totalTime,
    lastSaveDate: new Date().toISOString().split("T")[0],
  };

  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to save timer data:", error);
  }
}

function loadTimerData() {
  try {
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      totalTime = data.totalTime || 0;

      // Check if it's a new day
      const today = new Date().toISOString().split("T")[0];
      if (data.lastSaveDate !== today) {
        // Reset daily stats for new day
        todaySessions = 0;
        todayTime = 0;
        currentSessionTime = 0;
      }
    }
  } catch (error) {
    console.error("Failed to load timer data:", error);
  }
}

// Event listeners
minimizeBtn.addEventListener("click", async () => {
  try {
    await ipcRenderer.invoke("minimize-window");
  } catch (error) {
    console.error("Failed to minimize window:", error);
  }
});

closeBtn.addEventListener("click", async () => {
  try {
    // Save data before closing
    if (isRunning) {
      stopTimer();
    }
    stopActivitySimulation();
    saveTimerData();
    await ipcRenderer.invoke("close-window");
  } catch (error) {
    console.error("Failed to close window:", error);
  }
});

alwaysOnTopBtn.addEventListener("click", async () => {
  try {
    isAlwaysOnTop = await ipcRenderer.invoke("toggle-always-on-top");
    updateAlwaysOnTopStatus();
    updateAlwaysOnTopButton();
  } catch (error) {
    console.error("Failed to toggle always on top:", error);
  }
});

startStopBtn.addEventListener("click", () => {
  console.log("Button clicked, isRunning:", isRunning);
  if (isRunning) {
    console.log("Stopping timer...");
    stopTimer();
  } else {
    console.log("Starting timer...");
    startTimer();
  }
});

toggleBlurBtn.addEventListener("click", () => {
  blurLevel = (blurLevel + 1) % 4;
  updateBlurEffect();
  updateBlurButtonText();
});

changeOpacityBtn.addEventListener("click", () => {
  opacityLevel = (opacityLevel + 1) % 4;
  updateOpacityEffect();
  updateOpacityButtonText();
});

toggleTransparentZoneBtn.addEventListener("click", () => {
  transparentZoneVisible = !transparentZoneVisible;
  updateTransparentZone();
  updateTransparentZoneButtonText();
});

// Update functions
function updateAlwaysOnTopStatus() {
  // This function is kept for compatibility but not used in new UI
}

function updateAlwaysOnTopButton() {
  alwaysOnTopBtn.style.background = isAlwaysOnTop
    ? "rgba(76, 175, 80, 0.3)"
    : "rgba(255, 255, 255, 0.1)";
}

function updateWindowState(state) {
  // This function is kept for compatibility but not used in new UI
}

function updateBlurEffect() {
  appContainer.classList.remove("blur-light", "blur-heavy", "blur-off");

  switch (blurLevel) {
    case 0:
      break;
    case 1:
      appContainer.classList.add("blur-light");
      break;
    case 2:
      appContainer.classList.add("blur-heavy");
      break;
    case 3:
      appContainer.classList.add("blur-off");
      break;
  }
}

function updateOpacityEffect() {
  appContainer.classList.remove("opacity-50", "opacity-75", "opacity-100");

  switch (opacityLevel) {
    case 0:
      break;
    case 1:
      appContainer.classList.add("opacity-50");
      break;
    case 2:
      appContainer.classList.add("opacity-75");
      break;
    case 3:
      appContainer.classList.add("opacity-100");
      break;
  }
}

function updateBlurButtonText() {
  const blurTexts = [
    "Toggle Blur Effect",
    "Light Blur",
    "Heavy Blur",
    "No Blur",
  ];
  toggleBlurBtn.textContent = blurTexts[blurLevel];
}

function updateOpacityButtonText() {
  const opacityTexts = [
    "Change Opacity",
    "50% Opacity",
    "75% Opacity",
    "100% Opacity",
  ];
  changeOpacityBtn.textContent = opacityTexts[opacityLevel];
}

function updateTransparentZone() {
  if (transparentZoneVisible) {
    transparentZone.style.display = "block";
  } else {
    transparentZone.style.display = "none";
  }
}

function updateTransparentZoneButtonText() {
  toggleTransparentZoneBtn.textContent = transparentZoneVisible
    ? "Hide Transparent Zone"
    : "Show Transparent Zone";
}

// Add some interactive effects
document.addEventListener("DOMContentLoaded", () => {
  // Add click ripple effect to buttons
  const buttons = document.querySelectorAll(
    ".action-btn, .control-btn, .timer-btn"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add ripple effect styles dynamically
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .action-btn, .control-btn, .timer-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  updateTransparentZone();
  updateTransparentZoneButtonText();
});

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Space to start/stop timer
  if (e.key === " ") {
    e.preventDefault();
    startStopBtn.click();
  }

  // Ctrl/Cmd + Q to quit
  if ((e.ctrlKey || e.metaKey) && e.key === "q") {
    ipcRenderer.invoke("close-window");
  }

  // Ctrl/Cmd + M to minimize
  if ((e.ctrlKey || e.metaKey) && e.key === "m") {
    ipcRenderer.invoke("minimize-window");
  }

  // Ctrl/Cmd + T to toggle always on top
  if ((e.ctrlKey || e.metaKey) && e.key === "t") {
    alwaysOnTopBtn.click();
  }

  // B to toggle blur
  if (e.key === "b") {
    toggleBlurBtn.click();
  }

  // O to change opacity
  if (e.key === "o") {
    changeOpacityBtn.click();
  }

  // Z to toggle transparent zone
  if (e.key === "z") {
    toggleTransparentZoneBtn.click();
  }
});

// Add window focus/blur effects
window.addEventListener("focus", () => {
  appContainer.style.opacity = "1";
});

window.addEventListener("blur", () => {
  appContainer.style.opacity = "0.8";
});

// Save data periodically and on page unload
setInterval(() => {
  if (isRunning || totalTime > 0) {
    saveTimerData();
  }
}, 30000); // Save every 30 seconds

window.addEventListener("beforeunload", () => {
  if (isRunning) {
    stopTimer();
  }
  stopActivitySimulation();
  saveTimerData();
});

// Export functions for potential external use
window.electronApp = {
  startTimer: () => startTimer(),
  stopTimer: () => stopTimer(),
  toggleBlur: () => toggleBlurBtn.click(),
  changeOpacity: () => changeOpacityBtn.click(),
  toggleTransparentZone: () => toggleTransparentZoneBtn.click(),
  toggleAlwaysOnTop: () => alwaysOnTopBtn.click(),
  minimize: () => minimizeBtn.click(),
  close: () => closeBtn.click(),
};
