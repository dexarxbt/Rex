<div align="center">
  <img src="https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/initia.svg" width="80" alt="Initia Logo" />
  <h1 align="center">REX — The King's Game. On-Chain.</h1>
</div>

<p align="center">
  <video src="https://github.com/dexarxbt/Rex/raw/main/assets/landing-ani.mp4" width="800" autoplay loop muted playsinline></video>
</p>

<div align="center">
  
  <p align="center">
    <strong>A breathtakingly cinematic, fully decentralized 3D chess experience.</strong>
    <br />
    Built natively on the Initia appchain architecture.
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Blockchain-Initia-7c3aed?style=for-the-badge&logo=chainlink&logoColor=white" alt="Initia" />
    <img src="https://img.shields.io/badge/Smart%20Contracts-Move-blue?style=for-the-badge&logo=move&logoColor=white" alt="Move VM" />
    <img src="https://img.shields.io/badge/Frontend-React%20Three%20Fiber-black?style=for-the-badge&logo=react&logoColor=61DAFB" alt="R3F" />
  </p>
</div>

---

## Initia Hackathon Submission

- **Project Name**: REX

### Project Overview

REX elevates Web3 gaming by merging cinematic visual fidelity with the uncompromising security of the Initia Move VM. It is a fully on-chain 3D chess game where every move, checkmate, and ELO rating is validated and stored immutably on a custom rollup. Players can wager tokens, compete in live tournaments, and scrub through historic replays in stunning 3D. By abstracting the blockchain via Auto-Signing, REX delivers an immersive experience that feels like playing on a premium Web2 platform, not a clunky dApp.

### Implementation Detail

- **The Custom Implementation**: The entire rulebook of chess (including complex mechanics like en passant, castling, and pawn promotion) is rigorously verified on-chain via a custom Move smart contract. On the client side, REX features a custom-built React Three Fiber environment. The Staunton-style chess pieces are procedurally generated in the browser using dynamic `LatheGeometries` and `ExtrudeGeometries`—giving them a hyper-realistic, polished aesthetic complete with dynamic lighting and camera lerping.
- **The Native Feature**: REX elegantly implements **`auto-signing`** via InterwovenKit. This native feature is scoped exclusively to the `make_move` transaction. Players approve their session once, and all subsequent chess moves are submitted instantly in the background without intrusive wallet popups, establishing a frictionless gameplay loop.

### How to Run Locally

1. **Set Up the Appchain**: Run `weave init` (select Move VM, rex-1 chain ID).
2. **Deploy the Smart Contract**: Inside the `rex-contract` directory, execute `minitiad move deploy` using your gas station keys.
3. **Configure the Frontend**: Inside `rex-frontend`, duplicate `.env.example` to `.env` and assign your `VITE_MODULE_ADDRESS`.
4. **Launch**: Run `npm install` followed by `npm run dev`. Your cinematic chess experience will be live at `http://localhost:5173`.

---

## ✨ Features That Shine

### 🛡️ Ironclad Move Validation
The blockchain doesn't just store the game; it *is* the game. The Move smart contract calculates valid squares, intercepts illegal moves, and definitively awards checkmate and draw conditions.

### 🎭 Cinematic 3D Rendering
Say goodbye to flat 2D boards. REX renders a breathtaking, dark-mode 3D arena using React Three Fiber. Pieces are dynamically lit, casting real-time shadows, while smooth camera pans follow your every move.

### ⚡ Frictionless Auto-Signing
Blockchain gaming shouldn't mean signing 40 transactions per match. REX utilizes Initia's Native Auto-Signing—granting session-based permission to automatically execute your moves the second you drop a piece.

### 🏆 Tournaments & Wagering
Put your skills to the test. Create round-robin brackets, set entry fees in native `INIT` tokens, and let the smart contract securely distribute the prize pool to the ultimate victor.

### ⏪ Time-Travel Replays
Every game played on REX is permanently etched into the Initia ledger. You can pull up any past match and smoothly scrub forward and backward through the timeline, watching the 3D pieces perfectly reconstruct the battle.

---

## 🛠️ Architecture

```text
rex-initia/
├── rex-contract/               # The Engine
│   ├── Move.toml               # Package dependencies
│   └── sources/
│       └── chess.move          # Uncompromising on-chain logic
└── rex-frontend/               # The Experience
    ├── src/
    │   ├── App.jsx             # Shell & Routing
    │   ├── store/              # Zustand global state management
    │   ├── hooks/              # useChessGame (InterwovenKit integration)
    │   ├── components/
    │   │   ├── Board3D/        # Three.js meshes, procedural Staunton pieces
    │   │   ├── GameUI/         # Floating glassmorphic HUDs
    │   │   └── Lobby/          # Tournaments & Global Leaderboard
    │   └── styles/
    │       └── globals.css     # "Void & Neon" design system tokens
    └── package.json
```

---

<div align="center">
  <p>Built with 💜 for the <strong>INITIATE Hackathon Season 1</strong></p>
</div>
