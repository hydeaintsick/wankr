const { ipcRenderer } = require("electron");

// DOM elements
const minimizeBtn = document.getElementById("minimize-btn");
const closeBtn = document.getElementById("close-btn");
const alwaysOnTopBtn = document.getElementById("always-on-top-btn");
const toggleBlurBtn = document.getElementById("toggle-blur-btn");
const changeOpacityBtn = document.getElementById("change-opacity-btn");
const toggleTransparentZoneBtn = document.getElementById(
  "toggle-transparent-zone-btn"
);
const windowStateSpan = document.getElementById("window-state");
const alwaysOnTopStatusSpan = document.getElementById("always-on-top-status");
const appContainer = document.querySelector(".app-container");
const transparentZone = document.querySelector(".transparent-zone");

// State variables
let blurLevel = 0; // 0: normal, 1: light, 2: heavy, 3: off
let opacityLevel = 0; // 0: normal, 1: 50%, 2: 75%, 3: 100%
let isAlwaysOnTop = false;
let transparentZoneVisible = true;

// Initialize the app
async function initializeApp() {
  try {
    const windowState = await ipcRenderer.invoke("get-window-state");
    if (windowState) {
      isAlwaysOnTop = windowState.isAlwaysOnTop;
      updateAlwaysOnTopStatus();
      updateWindowState(windowState);
    }
  } catch (error) {
    console.error("Failed to get window state:", error);
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
  alwaysOnTopStatusSpan.textContent = isAlwaysOnTop ? "On" : "Off";
  alwaysOnTopStatusSpan.style.color = isAlwaysOnTop
    ? "rgba(76, 175, 80, 0.9)"
    : "rgba(255, 255, 255, 0.95)";
}

function updateAlwaysOnTopButton() {
  alwaysOnTopBtn.style.background = isAlwaysOnTop
    ? "rgba(76, 175, 80, 0.3)"
    : "rgba(255, 255, 255, 0.1)";
}

function updateWindowState(state) {
  if (state.isMinimized) {
    windowStateSpan.textContent = "Minimized";
    windowStateSpan.style.color = "rgba(255, 193, 7, 0.9)";
  } else if (state.isMaximized) {
    windowStateSpan.textContent = "Maximized";
    windowStateSpan.style.color = "rgba(33, 150, 243, 0.9)";
  } else {
    windowStateSpan.textContent = "Normal";
    windowStateSpan.style.color = "rgba(255, 255, 255, 0.95)";
  }
}

function updateBlurEffect() {
  // Remove all blur classes
  appContainer.classList.remove("blur-light", "blur-heavy", "blur-off");

  // Add appropriate blur class
  switch (blurLevel) {
    case 0: // Normal
      // No additional class needed, uses default CSS
      break;
    case 1: // Light
      appContainer.classList.add("blur-light");
      break;
    case 2: // Heavy
      appContainer.classList.add("blur-heavy");
      break;
    case 3: // Off
      appContainer.classList.add("blur-off");
      break;
  }
}

function updateOpacityEffect() {
  // Remove all opacity classes
  appContainer.classList.remove("opacity-50", "opacity-75", "opacity-100");

  // Add appropriate opacity class
  switch (opacityLevel) {
    case 0: // Normal
      // No additional class needed, uses default CSS
      break;
    case 1: // 50%
      appContainer.classList.add("opacity-50");
      break;
    case 2: // 75%
      appContainer.classList.add("opacity-75");
      break;
    case 3: // 100%
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
  // Add hover effects to feature items
  const featureItems = document.querySelectorAll(".feature-item");
  featureItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateY(-4px) scale(1.02)";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add click ripple effect to buttons
  const buttons = document.querySelectorAll(".action-btn, .control-btn");
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
    
    .action-btn, .control-btn {
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

  // Space to toggle blur
  if (e.key === " ") {
    e.preventDefault();
    toggleBlurBtn.click();
  }

  // O to change opacity
  if (e.key === "o") {
    changeOpacityBtn.click();
  }

  // T to toggle transparent zone
  if (e.key === "t") {
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

// Add smooth animations for state changes
function animateStateChange(element, newState) {
  element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  element.style.transform = "scale(0.95)";

  setTimeout(() => {
    element.style.transform = "scale(1)";
  }, 150);
}

// Export functions for potential external use
window.electronApp = {
  toggleBlur: () => toggleBlurBtn.click(),
  changeOpacity: () => changeOpacityBtn.click(),
  toggleTransparentZone: () => toggleTransparentZoneBtn.click(),
  toggleAlwaysOnTop: () => alwaysOnTopBtn.click(),
  minimize: () => minimizeBtn.click(),
  close: () => closeBtn.click(),
};
