# ZCODER Development Setup

## 🚀 Quick Start Options (Choose One)

### ⭐ **Option 1: Super Easy - Double-click** (Recommended)
Simply double-click **`quick-start.bat`** in the project root directory. This will:
- Start both servers in separate windows
- Show clear status messages
- Display server URLs
- Auto-close after starting servers

### **Option 2: Alternative Batch File**
Double-click **`run.bat`** for a fancier startup experience with ASCII art.

### **Option 3: Manual Batch Script**
Run **`start-dev.bat`** from command line or by double-clicking it.

### **Option 4: PowerShell**
Run **`start-dev.ps1`** in PowerShell:
```powershell
.\start-dev.ps1
```

### **Option 5: Using npm scripts**
If you prefer npm scripts:

**For concurrent execution (requires concurrently package):**
```bash
npm install    # Install concurrently package
npm run dev    # Start both servers
```

**For simple execution (Windows only):**
```bash
npm run dev:simple    # Uses Windows commands
```

**Individual servers:**
```bash
npm run dev:backend   # Start only backend
npm run dev:frontend  # Start only frontend
```

## 🌐 Server Information
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## 📝 What happens when you run the scripts:
1. **Backend server** starts in a new terminal window
2. Script waits 3 seconds for backend to initialize
3. **Frontend server** starts in another new terminal window
4. Both servers continue running in their respective windows

## 🛑 Stopping the servers:
- **Easy way**: Close the individual terminal windows for each server
- **Command way**: Press `Ctrl+C` in each server terminal

## 🔧 Manual start (if scripts don't work):
1. **Terminal 1**: `cd backend && npm start`
2. **Terminal 2**: `cd frontend && npm start`

## 📦 First-time setup:
```bash
# Install all dependencies for all projects
npm run install:all
```

## ❗ Troubleshooting:
- **Scripts not working**: Try `quick-start.bat` - it's the simplest
- **Port conflicts**: Make sure ports 3000 and 5000 are available
- **Dependencies missing**: Run `npm install` in both frontend and backend directories
- **Node.js not found**: Make sure Node.js and npm are installed and in your PATH

## 💡 Pro Tips:
- Use `quick-start.bat` for daily development - it's the fastest
- Keep both terminal windows open to see server logs
- The frontend will automatically open in your browser
- Backend API will be available for frontend to connect to
