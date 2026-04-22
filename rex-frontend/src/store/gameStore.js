import { create } from 'zustand'

export const useGameStore = create((set) => ({
  // Current game
  gameId: null,
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  gameStatus: null,
  whiteAddress: null,
  blackAddress: null,
  moveHistory: [],
  lastMove: null,

  // UI state
  selectedSquare: null,
  legalMoves: [],
  captureSquare: null,
  checkSquare: null,
  isCheckmate: false,
  pendingMove: false,

  // Lobby state
  activeGames: [],
  playerProfile: null,
  leaderboard: [],
  tournaments: [],

  // View
  currentView: 'landing', // landing | lobby | game | spectate | replay | tournament

  setGameId: (id) => set({ gameId: id }),
  setFen: (fen) => set({ fen }),
  setGameStatus: (s) => set({ gameStatus: s }),
  setPlayers: (w, b) => set({ whiteAddress: w, blackAddress: b }),
  setMoveHistory: (h) => set({ moveHistory: h }),
  setLastMove: (m) => set({ lastMove: m }),
  setSelectedSquare: (sq) => set({ selectedSquare: sq }),
  setLegalMoves: (moves) => set({ legalMoves: moves }),
  setCaptureSquare: (sq) => set({ captureSquare: sq }),
  setCheckSquare: (sq) => set({ checkSquare: sq }),
  setIsCheckmate: (v) => set({ isCheckmate: v }),
  setPendingMove: (v) => set({ pendingMove: v }),
  setActiveGames: (g) => set({ activeGames: g }),
  setPlayerProfile: (p) => set({ playerProfile: p }),
  setLeaderboard: (l) => set({ leaderboard: l }),
  setTournaments: (t) => set({ tournaments: t }),
  addTournament: (t) => set((state) => ({ tournaments: [...state.tournaments, t] })),
  setView: (v) => set({ currentView: v }),

  resetGame: () => set({
    gameId: null,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    gameStatus: null,
    whiteAddress: null,
    blackAddress: null,
    moveHistory: [],
    lastMove: null,
    selectedSquare: null,
    legalMoves: [],
    captureSquare: null,
    checkSquare: null,
    isCheckmate: false,
    pendingMove: false,
  }),
}))
