markdown# 🩺 AI Clinical Assistant Widget

A real-time terminal-style control panel for monitoring AI clinical assistant calls with a sci-fi aesthetic.

![AI Clinical Assistant Demo](https://via.placeholder.com/800x400/000000/00ff00?text=AI+Clinical+Assistant+Terminal)

## ✨ Features

- 🎵 **Live Audio Waveform** - Real-time visualization with speaker-based coloring
- 💬 **Live Transcription** - Speech-to-text with speaker identification  
- 🩺 **Voice Diagnostics** - Health analysis with traffic light indicators 🚦
- 🧠 **AI Reasoning** - Step-by-step decision process monitoring
- 🖥️ **Terminal UI** - Compact console-style interface inspired by sci-fi movies

## 🚦 Traffic Light Health System

- 🟢 **Green** - Normal, all clear
- 🟡 **Yellow** - Mild concern, monitoring recommended
- 🟠 **Orange** - Moderate issue, attention needed  
- 🔴 **Red** - Severe, immediate attention required

## 🛠️ Tech Stack

- React 18
- Tailwind CSS (Terminal/Matrix theme)
- Lucide React Icons
- HTML5 Canvas for real-time waveforms
- WebSocket ready for live data integration

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-clinical-assistant.git
cd ai-clinical-assistant

# Install dependencies
npm install

# Start development server
npm start
Open http://localhost:3000 to view it in the browser.
📦 Production Build
bashnpm run build
🌐 Live Demo
View Live Demo
🔌 WebSocket Integration
The widget supports real-time data via WebSocket connections. Ready to connect to your AI clinical assistant backend.
🎨 Design Philosophy
Inspired by terminal interfaces and sci-fi medical consoles, featuring:

Matrix-style green-on-black color scheme
Monospace fonts for authentic terminal feel
Compact layout optimized for medical dashboards
Real-time log streaming with timestamps

📄 License
MIT License - feel free to use in your medical AI projects!

## **🔧 Add GitHub Actions (Optional)**

Create `.github/workflows/deploy.yml` for automatic deployments:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Vercel
      uses: vercel/action@v1
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
🏷️ Create Release Tags
bash# Tag your current version
git tag -a v1.0.0 -m "🚀 Initial Release: Terminal-style AI Clinical Assistant

Features:
- Real-time audio waveform visualization
- Live transcription with speaker detection  
- Voice diagnostics with traffic light system
- AI reasoning engine monitoring
- Compact terminal-style interface"

git push origin v1.0.0
📋 .gitignore File
Make sure you have a proper .gitignore:
gitignore# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
