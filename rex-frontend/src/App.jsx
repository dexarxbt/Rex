import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInterwovenKit, useUsernameQuery } from '@initia/interwovenkit-react'
import { Crown, Trophy, Swords, Sparkles, Server, Bot, Tv, Cpu } from 'lucide-react'
import { Scene } from './components/Board3D/Scene'
import { PlayerCard } from './components/GameUI/PlayerCard'
import { MoveHistory } from './components/GameUI/MoveHistory'
import { GameControls } from './components/GameUI/GameControls'
import { CreateGame } from './components/Lobby/CreateGame'
import { Leaderboard } from './components/Lobby/Leaderboard'
import { TournamentLobby } from './components/Lobby/Tournament'
import { GameReplay } from './components/Lobby/GameReplay'
import { LandingView } from './components/Lobby/LandingView'
import { useChessGame } from './hooks/useChessGame'
import { useGameStore } from './store/gameStore'
import './styles/globals.css'

const TABS = [
  { id: 'lobby',      label: 'Games',        icon: <Swords size={16} /> },
  { id: 'tournament', label: 'Tournaments',  icon: <Trophy size={16} /> },
  { id: 'leaderboard',label: 'Leaderboard',  icon: <Crown size={16} /> },
]

function Header() {
  const { initiaAddress, openConnect, openWallet } = useInterwovenKit()
  const { data: username } = useUsernameQuery(initiaAddress)
  const { currentView, setView } = useGameStore()

  const displayName = username
    ? username
    : initiaAddress
      ? `${initiaAddress.slice(0,8)}...${initiaAddress.slice(-4)}`
      : null

  return (
    <header style={{
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(15,15,26,0.9)',
      backdropFilter: 'blur(16px)',
      position: 'relative',
      zIndex: 50,
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => setView('lobby')}
      >
        <span style={{ fontSize: 20 }}>♔</span>
        <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.02em' }}>REX</span>
        <span style={{
          fontSize: 9, fontWeight: 600, color: 'var(--accent-light)',
          background: 'rgba(124,58,237,0.15)',
          padding: '2px 7px', borderRadius: 99,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Live on Initia
        </span>
      </div>

      <nav style={{ display: 'flex', gap: 4, position: 'relative' }}>
        {TABS.map((tab) => {
          const isActive = currentView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                position: 'relative',
                padding: '10px 20px',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#0f0f1a' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 14,
                fontFamily: 'var(--font-fancy)',
                fontWeight: isActive ? 700 : 500,
                borderRadius: 'var(--r-full)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 8px 30px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.05)' : 'none',
                zIndex: 2,
              }}
            >
              <span style={{ color: isActive ? '#7c3aed' : 'currentColor' }}>{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}
      </nav>

      {!initiaAddress ? (
        <button className="btn btn-primary btn-sm" onClick={openConnect}>
          Connect Wallet
        </button>
      ) : (
        <button
          className="btn btn-ghost btn-sm"
          onClick={openWallet}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {displayName}
        </button>
      )}
    </header>
  )
}

function LobbyView({ onJoinGame, onCreateGame }) {
  const { activeGames } = useGameStore()
  const { initiaAddress } = useInterwovenKit()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ textAlign: 'center', padding: '32px 0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <Crown size={48} color="var(--accent-light)" style={{ filter: 'drop-shadow(0 0 20px var(--accent-glow))' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 900, letterSpacing: '-0.04em', background: 'var(--grad-royal)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px var(--accent-glow))' }}>
          THE KING'S GAME
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 16, fontFamily: 'var(--font-sans)', opacity: 0.8 }}>
          On-chain chess on Initia. Every move immutable. Every wager automatic.
        </p>
        
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32 }}>
          {initiaAddress ? (
            <button className="btn btn-primary btn-lg" onClick={onCreateGame} style={{ display: 'flex', alignItems: 'center' }}>
              <Swords size={18} /> Challenge a Player
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={() => document.querySelector('.btn-primary')?.click()} style={{ display: 'flex', alignItems: 'center' }}>
              <Server size={18} /> Connect to Play
            </button>
          )}
          <button className="btn btn-ghost btn-lg" style={{ display: 'flex', alignItems: 'center' }} onClick={() => {
            useGameStore.getState().setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
            useGameStore.getState().setLastMove(null)
            onJoinGame('bot')
          }}>
            <Bot size={18} /> Play Computer
          </button>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="label">Live Games</div>
          <span className="badge badge-live">{activeGames.length} active</span>
        </div>

        {!activeGames.length ? (
          <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-faint)' }}>
            No active games. Create one to start playing!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeGames.map((game) => (
              <motion.div
                key={game.id}
                className="card"
                whileHover={{ borderColor: 'rgba(124,58,237,0.3)' }}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => onJoinGame(game.id, true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="badge badge-live">Live</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                    Game #{game.id}
                  </span>
                </div>
                {game.wager > 0 && (
                  <span className="badge-wager">
                    <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {(game.wager / 1e6).toFixed(2)} {import.meta.env.VITE_NATIVE_SYMBOL}
                  </span>
                )}
                <button className="btn btn-ghost btn-sm">
                  <Tv size={14} /> Watch
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GameView() {
  const {
    fen, gameStatus, selectedSquare, legalMoves,
    pendingMove, isCheckmate, isAutoSignEnabled,
    handleSquareClick, resign, toggleAutoSign, chess
  } = useChessGame()

  const {
    gameId, whiteAddress, blackAddress,
    checkSquare, captureSquare, lastMove,
    moveHistory, setFen, setLastMove
  } = useGameStore()

  const { initiaAddress } = useInterwovenKit()
  const [showReplay, setShowReplay] = useState(false)

  const isWhiteTurn = fen?.includes(' w ')
  const amWhite = gameId === 'bot' ? true : whiteAddress === initiaAddress

  // Bot artificial intelligence loop
  useEffect(() => {
    if (gameId === 'bot' && !isWhiteTurn && !isCheckmate) {
      const timer = setTimeout(() => {
        const moves = chess.moves({ verbose: true })
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)]
          chess.move(move.san)
          setLastMove({ from: move.from, to: move.to })
          setFen(chess.fen())
        }
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [fen, isWhiteTurn, isCheckmate, gameId, chess, setFen, setLastMove])

  if (!gameId && gameId !== 0 && gameId !== 'bot') return <div style={{ padding: 40, textAlign: 'center' }}>Loading game...</div>

  return (
    <div style={{ height: 'calc(100vh - 56px)', display: 'grid', gridTemplateColumns: '1fr 300px' }}>
      <div style={{ position: 'relative', background: 'radial-gradient(ellipse at center, #0d0a1a 0%, var(--bg-void) 70%)' }}>
        {pendingMove && (
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--r-full)',
            padding: '6px 16px',
            fontSize: 12,
            color: 'var(--accent-light)',
            backdropFilter: 'blur(8px)',
          }}>
            Submitting move...
          </div>
        )}
        {fen && <Scene
          fen={fen}
          onSquareClick={handleSquareClick}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          checkSquare={checkSquare}
          captureSquare={captureSquare}
          isCheckmate={isCheckmate}
        />}
        {(isCheckmate || chess.isDraw() || gameStatus === 'finished') && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100
          }}>
            <div className="card-gold" style={{ padding: '40px 60px', textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>{isCheckmate ? '👑' : '🤝'}</div>
              <h2 style={{ fontFamily: 'var(--font-fancy)', fontSize: 32, fontWeight: 800, margin: '16px 0 8px', color: 'var(--gold)' }}>
                {isCheckmate ? 'Checkmate!' : chess.isDraw() ? 'Draw!' : 'Game Over'}
              </h2>
              <div style={{ color: 'var(--text-muted)' }}>
                {isCheckmate ? 'The king has fallen.' : 'A peaceful resolution.'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-surface)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 16px 8px' }}>
          {blackAddress && <PlayerCard
            address={blackAddress}
            timeMs={300000}
            isActive={!isWhiteTurn}
            isWhite={false}
            isYou={!amWhite}
          />}
        </div>

        <div style={{ flex: 1, padding: '0 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="label">Move History</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {moveHistory && <MoveHistory moves={moveHistory} />}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowReplay(true)}
            style={{ alignSelf: 'flex-start' }}
          >
            ▶ Replay
          </button>
        </div>

        <div style={{ padding: '8px 16px' }}>
          {<GameControls
            onResign={resign}
            onToggleAutoSign={toggleAutoSign}
            isAutoSignEnabled={isAutoSignEnabled}
          />}
        </div>

        <div style={{ padding: '8px 16px 16px' }}>
          {whiteAddress && <PlayerCard
            address={whiteAddress}
            timeMs={300000}
            isActive={isWhiteTurn}
            isWhite={true}
            isYou={amWhite}
          />}
        </div>
      </div>

      {showReplay && (
        <GameReplay
          moves={moveHistory?.map(m => m.san) || []}
          onClose={() => setShowReplay(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  const { currentView, setView } = useGameStore()
  const tournaments = useGameStore((state) => state.tournaments)
  const [showCreateGame, setShowCreateGame] = useState(false)

  return (
    <div className="app-shell">
      <Header />

      <main style={{ overflow: 'auto' }}>
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ height: '100%' }}
            >
              <LandingView onCreateGame={() => setShowCreateGame(true)} />
            </motion.div>
          )}

          {currentView === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ height: '100%' }}
            >
              <LobbyView
                onCreateGame={() => setShowCreateGame(true)}
                onJoinGame={(id) => { useGameStore.getState().setGameId(id); setView('game') }}
              />
            </motion.div>
          )}

          {currentView === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ height: '100%' }}
            >
              <GameView />
            </motion.div>
          )}

          {currentView === 'tournament' && (
            <motion.div
              key="tournament"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}
            >
              <TournamentLobby 
                tournaments={tournaments} 
                onCreate={(t) => useGameStore.getState().addTournament({ ...t, id: Date.now().toString().slice(-4), creator: 'me', players: [], status: 0 })} 
                onJoin={(id) => {}} 
                onStart={(id) => {}} 
              />
            </motion.div>
          )}

          {currentView === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '24px', maxWidth: 700, margin: '0 auto' }}
            >
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-fancy)' }}>Leaderboard</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'var(--font-sans)', marginTop: 4 }}>
                  Global ELO rankings stored on-chain
                </div>
              </div>
              <Leaderboard players={[]} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showCreateGame && <CreateGame onClose={() => setShowCreateGame(false)} />}
      </AnimatePresence>
    </div>
  )
}
