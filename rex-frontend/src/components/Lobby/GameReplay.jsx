import { useState, useEffect, useRef, useCallback } from 'react'
import { Chess } from 'chess.js'
import { Scene } from '../Board3D/Scene'
import { MoveHistory } from '../GameUI/MoveHistory'
import { motion } from 'framer-motion'

export function GameReplay({ moves = [], onClose }) {
  const [chess] = useState(() => new Chess())
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [fen, setFen] = useState(chess.fen())
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const intervalRef = useRef(null)
  const allMoves = useRef([])

  useEffect(() => {
    const c = new Chess()
    allMoves.current = []
    for (const m of moves) {
      try { const result = c.move(m); allMoves.current.push(result) } catch {}
    }
  }, [moves])

  const jumpTo = useCallback((idx) => {
    const c = new Chess()
    for (let i = 0; i <= idx && i < allMoves.current.length; i++) {
      c.move(allMoves.current[i].san)
    }
    setFen(c.fen())
    setCurrentIdx(idx)
  }, [])

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!isPlaying) return
    intervalRef.current = setInterval(() => {
      setCurrentIdx((prev) => {
        const next = prev + 1
        if (next >= allMoves.current.length) {
          setIsPlaying(false)
          return prev
        }
        jumpTo(next)
        return next
      })
    }, 900 / speed)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speed, jumpTo])

  const total = allMoves.current.length

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-void)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>♟</span>
          <span style={{ fontWeight: 700 }}>Game Replay</span>
          <span style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            Move {currentIdx + 1} / {total}
          </span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Close ×</button>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <Scene fen={fen} interactive={false} />
        </div>

        <div style={{
          borderLeft: '1px solid var(--border)',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
        }}>
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Move History</div>
            <MoveHistory
              moves={allMoves.current}
              currentMoveIndex={currentIdx}
              onMoveClick={jumpTo}
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="card"
        style={{
          borderRadius: 0,
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <input
          type="range"
          min={-1}
          max={total - 1}
          value={currentIdx}
          onChange={(e) => jumpTo(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent)', height: 4 }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-icon" onClick={() => jumpTo(-1)}>⏮</button>
          <button className="btn btn-ghost btn-icon" onClick={() => jumpTo(Math.max(-1, currentIdx - 1))}>⏪</button>
          <button
            className="btn btn-primary"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ width: 56 }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => jumpTo(Math.min(total - 1, currentIdx + 1))}>⏩</button>
          <button className="btn btn-ghost btn-icon" onClick={() => jumpTo(total - 1)}>⏭</button>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{
              marginLeft: 12,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-primary)',
              padding: '6px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
            }}
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={4}>4×</option>
          </select>
        </div>
      </motion.div>
    </div>
  )
}
