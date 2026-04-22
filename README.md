<p align="center">
  <img src="assets/initia-logo.gif" width="100" alt="REX" />
</p>

<h1 align="center">REX — THE KING'S GAME</h1>

<p align="center">
  <strong>A premium, fully on-chain 3D chess experience built on Initia.</strong>
</p>

<p align="center">
  <img src="assets/landing-ani.gif" width="850" alt="REX Preview" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-Initia-7c3aed?style=for-the-badge&logo=chainlink&logoColor=white" />
  <img src="https://img.shields.io/badge/Smart_Contracts-Move-blue?style=for-the-badge&logo=move&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-R3F-black?style=for-the-badge&logo=react&logoColor=61DAFB" />
</p>

---

## ♟️ Overview

REX is a production-grade 3D chess platform where every move is validated and settled on the **Initia Appchain**. By combining the cinematic visual power of React Three Fiber with the ironclad security of the Move VM, REX delivers a frictionless gaming experience that looks premium and functions immutably.

---

## 🔥 Key Features

- **Ironclad On-Chain Logic**: The Move smart contract verifies all chess rules, ensuring zero cheating and definitive game states.
- **Cinematic 3D Visuals**: A dark-mode, high-fidelity 3D arena with real-time lighting, shadows, and camera movement.
- **Native Auto-Signing**: Powered by InterwovenKit, moves are submitted instantly in the background for a seamless gameplay loop.
- **Tournament & Wagering**: Create live tournaments and wager tokens in a secure, decentralized environment.
- **3D Replay System**: Revisit any game with a fully interactive timeline, allowing you to scrub through moves in 3D.

---

## 🛠️ Tech Stack

- **Network**: Initia Appchain (Custom Rollup)
- **Contracts**: Move VM (Formal verification)
- **Frontend**: React + React Three Fiber (WebGI-inspired rendering)
- **State**: Zustand (Atomic game state management)
- **Wallet**: InterwovenKit (Native Auto-Signing)

---

## ⚡ Quick Start

1.  **Deploy the Appchain**
    ```bash
    weave init --vm move --chain-id rex-1
    ```
2.  **Deploy the Contract**
    ```bash
    cd rex-contract && minitiad move deploy
    ```
3.  **Run the App**
    ```bash
    cd rex-frontend && npm install && npm run dev
    ```

---

<p align="center">
  Built with 💜 for the <strong>INITIATE Hackathon Season 1</strong>
</p>

<p align="center">
  <sub>REX — On-Chain Chess Platform © 2026</sub>
</p>
