# Electron Transparent Blur Boilerplate

A modern Electron application boilerplate featuring transparent windows with blur effects, frameless design, and a beautiful UI.

## ✨ Features

- **Transparent Background**: Fully transparent window with backdrop blur effects
- **Frameless Window**: Custom title bar with window controls
- **Blur Effects**: Multiple blur levels (light, heavy, off)
- **Opacity Control**: Adjustable transparency levels
- **Always on Top**: Toggle window to stay on top
- **Modern UI**: Clean, glassmorphism design with smooth animations
- **Keyboard Shortcuts**: Quick access to all features
- **Responsive Design**: Works on different screen sizes
- **Cross-platform**: Works on macOS, Windows, and Linux

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. For development with DevTools:
   ```bash
   npm run dev
   ```

## 🎮 Usage

### Window Controls

- **Minimize**: Click the minimize button or press `Ctrl/Cmd + M`
- **Close**: Click the close button or press `Ctrl/Cmd + Q`
- **Always on Top**: Click the pin icon or press `Ctrl/Cmd + T`

### Visual Effects

- **Toggle Blur**: Click "Toggle Blur Effect" button or press `Space`
  - Cycles through: Normal → Light → Heavy → No Blur
- **Change Opacity**: Click "Change Opacity" button or press `O`
  - Cycles through: Normal → 50% → 75% → 100%

### Keyboard Shortcuts

| Shortcut       | Action               |
| -------------- | -------------------- |
| `Ctrl/Cmd + Q` | Quit application     |
| `Ctrl/Cmd + M` | Minimize window      |
| `Ctrl/Cmd + T` | Toggle always on top |
| `Space`        | Toggle blur effect   |
| `O`            | Change opacity       |

## 🛠️ Development

### Project Structure

```
├── main.js          # Main Electron process
├── renderer.js      # Renderer process (UI logic)
├── index.html       # Main HTML file
├── styles.css       # Styles and animations
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

### Building for Production

```bash
# Build the application
npm run build

# Create distributable packages
npm run dist
```

### Customization

#### Changing Blur Effects

Edit the CSS classes in `styles.css`:

```css
.app-container.blur-light {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.app-container.blur-heavy {
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}
```

#### Modifying Window Settings

Update the window configuration in `main.js`:

```javascript
mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  transparent: true,
  frame: false,
  vibrancy: "under-window",
  // ... other options
});
```

#### Adding New Features

1. Add UI elements to `index.html`
2. Style them in `styles.css`
3. Add event handlers in `renderer.js`
4. Add IPC handlers in `main.js` if needed

## 🎨 Design Features

### Glassmorphism Effect

The app uses modern glassmorphism design principles:

- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows
- Smooth animations

### Color Scheme

- Primary: White with transparency
- Accent: Blue and green for status indicators
- Background: Transparent with blur

### Animations

- Smooth transitions on all interactive elements
- Ripple effects on button clicks
- Hover animations
- State change animations

## 🔧 Configuration

### Window Settings

The main window is configured with these key settings:

- `transparent: true` - Enables transparency
- `frame: false` - Removes default window frame
- `vibrancy: 'under-window'` - Enables blur effects (macOS)
- `visualEffectState: 'active'` - Keeps blur effects active

### Platform-Specific Features

#### macOS

- Native vibrancy effects
- Smooth blur transitions
- Native window controls

#### Windows

- Backdrop blur effects
- Custom window controls
- Transparency support

#### Linux

- Basic transparency support
- Custom window controls
- Limited blur effects

## 📦 Dependencies

- **electron**: Main framework
- **electron-builder**: Build and packaging tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Electron team for the amazing framework
- Modern CSS techniques for glassmorphism effects
- Community for inspiration and feedback

## 🐛 Troubleshooting

### Common Issues

1. **Blur effects not working on Windows**

   - Ensure you're using Windows 10/11
   - Check if transparency effects are enabled in Windows settings

2. **App not starting**

   - Check Node.js version (requires v16+)
   - Ensure all dependencies are installed
   - Check console for error messages

3. **Performance issues**
   - Reduce blur intensity in CSS
   - Disable animations for better performance
   - Check system resources

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Ensure all dependencies are up to date
3. Try running in development mode with DevTools
4. Create an issue with detailed information

---

**Enjoy building beautiful transparent Electron apps! ✨**
