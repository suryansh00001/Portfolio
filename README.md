# 💻 Suryansh Garg's Interactive Portfolio

A modern interactive portfolio featuring a **retro terminal interface** and **3D ID Card** built with React, TypeScript, Three.js, and TailwindCSS. Experience a unique cyberpunk-themed portfolio that combines nostalgic terminal aesthetics with cutting-edge 3D graphics.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-19.0.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.176.0-orange)

---

## ✨ Features

### 🖥️ Interactive Terminal Portfolio
- **Retro Terminal UI** – Authentic command-line experience with blinking cursor
- **Multiple Commands** – `about`, `projects`, `skills`, `experience`, `education`, `contact`, and more
- **Command History** – Navigate through previous commands with arrow keys
- **Auto-scrolling** – Smooth scrolling to latest output
- **Responsive Design** – Adapts to different screen sizes

### 🎴 3D ID Card
- **Interactive 3D Card** – Realistic ID card with proper lighting and shadows
- **Personal Information** – Name, user ID, batch, and profile picture
- **QR Code & Barcode** – Generated dynamically from user data
- **Custom Typography** – Multiple font support including Minecraft and Bangers fonts
- **Rounded Corners** – Professional card design with rounded edges

### 🎨 Design & UX
- **Cyberpunk Aesthetic** – Green-on-black terminal theme with glowing effects
- **Responsive Layout** – Desktop shows both terminal and 3D card, mobile focuses on terminal
- **Real-time Clock** – Live timestamp in the status bar
- **Smooth Animations** – Seamless transitions between desktop and mobile views

---

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0** with TypeScript
- **Vite** for blazing fast development
- **TailwindCSS** for utility-first styling

### 3D Graphics
- **Three.js 0.176.0** for 3D rendering
- **React Three Fiber** for declarative 3D scenes
- **React Three Drei** for useful helpers and abstractions
- **React Three Rapier** for physics simulation

### Utilities
- **JSBarcode** for barcode generation
- **QR Code Styling** for QR code creation
- **Custom Fonts** (ApfelGrotezk, Bangers, Minecraft)

---

## � Project Structure

```
📁 Portfolio
├── 📁 public
│   ├── card.glb                    # 3D card model
│   ├── 📁 font                     # Custom fonts
│   │   ├── ApfelGrotezk.otf
│   │   ├── Bangers.ttf
│   │   └── Minecraft.ttf
│   └── 📁 images
│       ├── mypic.jpg              # Profile picture
│       └── template.svg           # Card template
├── 📁 src
│   ├── App.tsx                    # Main app component
│   ├── 📁 idCard                  # 3D ID Card module
│   │   ├── IdCard.tsx
│   │   ├── 📁 components
│   │   │   ├── Card.tsx           # 3D card component
│   │   │   ├── CardTexture.tsx    # Card texture mapping
│   │   │   ├── CreateText.tsx     # Text rendering
│   │   │   └── Experience.tsx     # 3D scene setup
│   │   ├── 📁 hook
│   │   │   └── useBarcodeAndQRCode.ts
│   │   ├── 📁 lib
│   │   │   └── RoundedPlaneGeometry.ts
│   │   └── 📁 types
│   │       └── types.d.ts
│   └── 📁 terminal                # Terminal interface module
│       ├── index.ts
│       ├── 📁 components
│       │   └── Terminal.tsx       # Terminal component
│       └── 📁 data
│           └── commands.ts        # Terminal commands data
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suryansh00001/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🎮 Terminal Commands

Once the portfolio is running, try these commands in the terminal:

- `help` - Show all available commands
- `about` - Learn about Suryansh Garg
- `projects` - Explore featured projects
- `skills` - View technical skills & tools
- `experience` - Professional & research background
- `education` - Academic milestones
- `contact` - Get contact information
- `clear` - Clear the terminal
- `sudo` - Try it and see! 😉

---

## 🎯 Key Highlights

- **Sophomore at IIT BHU** studying Computer Science
- **AI & ML Enthusiast** with focus on practical applications
- **Full-Stack Developer** with modern web technologies
- **Cybersecurity Interest** and ethical hacking
- **Competitive Programming** and algorithmic problem solving
- **Active in Hackathons** and open-source contributions

---

## 📱 Responsive Design

- **Desktop (≥1024px)**: Shows both 3D ID card and terminal side by side
- **Tablet/Mobile (<1024px)**: Focuses on terminal interface for better mobile experience
- **Smooth transitions** between different screen sizes

---

## 🔮 Future Enhancements

- [ ] Add more interactive 3D elements
- [ ] Implement theme switching (cyberpunk/retro/modern)
- [ ] Add sound effects for terminal interactions
- [ ] Create more detailed project showcases
- [ ] Add animated background effects
- [ ] Implement terminal command auto-completion

---

## � License

MIT License © 2025 Suryansh Garg

---

## 🤝 Connect

Feel free to explore the terminal interface to find all my contact information and social links! Type `contact` in the terminal once the portfolio is loaded.

**Built with ❤️ by Suryansh Garg**
