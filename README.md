<p align="center">
  <img src="assets/initia-logo.gif" width="80" alt="REX" />
</p>

<h1 align="center">REX</h1>

<p align="center">
  A high-fidelity chess protocol built on the Initia Appchain.
</p>

<p align="center">
  <img src="assets/landing-ani.gif" width="100%" alt="REX Preview" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Network-Initia-7c3aed?style=flat-square" />
  <img src="https://img.shields.io/badge/Language-Move-007bff?style=flat-square" />
  <img src="https://img.shields.io/badge/Graphics-R3F-000000?style=flat-square" />
</p>

## Abstract

REX represents the convergence of ancient strategy and modern distributed systems. It is a sovereign chess arena where every move is an immutable transaction on a dedicated rollup. By leveraging the Initia Move VM, REX ensures that game logic is formally verified, while a React Three Fiber frontend provides a cinematic interface previously reserved for desktop applications.

## Technical Foundation

### Move VM Integration
The core engine of REX is a custom Move smart contract that implements the complete rulebook of chess. This includes complex state transitions such as castling, en passant, and pawn promotion. The MoveVM provides the safety guarantees necessary to ensure that game state remains corruption-proof.

### Procedural Geometry
Every piece on the REX board is procedurally generated in the browser. Instead of loading static assets, the frontend utilizes custom lathe and extrude geometries to create hyper-realistic Staunton pieces. This approach allows for dynamic mesh refinement and significantly reduced load times.

### Kinetic Interaction
The camera system uses spherical interpolation to track the progression of the match. It adapts to the active player's perspective and the intensity of the board state, providing a fluid, immersive experience that abstracts the underlying blockchain interactions.

### Enshrined Auto-Signing
Friction is the primary barrier to blockchain gaming. REX utilizes Initia's native auto-signing via InterwovenKit. This allows for session-based transaction approval, enabling players to submit moves instantly without the interruption of wallet confirmation prompts.

## Core Features

### Temporal Replay Engine
Match history is archived as a series of ledger state changes. The replay engine allows users to scrub through the timeline of any match, reconstructing the 3D board state at any point in the game's history.

### On-Chain Tournaments
REX includes a sovereign tournament module. Brackets, entry fees, and prize distributions are handled automatically by the smart contract, providing a transparent and trustless competitive environment.

### Wagered Protocol
Players can stake native tokens on their performance. The smart contract acts as a secure escrow, automatically settling wagers based on the cryptographic outcome of the match.

## Quick Start

```bash
# Initialize the Appchain
weave init --vm move --chain-id rex-1

# Deploy the Protocol
cd rex-contract && minitiad move deploy

# Launch the Interface
cd rex-frontend && npm i && npm run dev
```

<p align="center">
  Built for the Initia Hackathon Season 1.
</p>
