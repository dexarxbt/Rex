import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInterwovenKit } from '@initia/interwovenkit-react'
import { useChessGame } from '../../hooks/useChessGame'

const TIME_CONTROLS = [
  { label: 'Bullet',  ms: 60000,   sub: '1+0' },
  { label: 'Blitz',   ms: 180000,  sub: '3+0' },
  { label: 'Blitz',   ms: 300000,  sub: '5+0' },
  { label: 'Rapid',   ms: 600000,  sub: '10+0' },
  { label: 'Classical', ms: 1800000, sub: '30+0' },
]

export function CreateGame({ onClose }) {
  const { initiaAddress, openBridge } = useInterwovenKit()
  const { createGame } = useChessGame()
  const [opponent, setOpponent] = useState('')
  const [wager, setWager] = useState('0')
  const [timeControl, setTimeControl] = useState(TIME_CONTROLS[1])
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!opponent || creating) return
    setCreating(true)
    try {
      await createGame(opponent, Math.floor(parseFloat(wager) * 1e6), timeControl.ms)
      onClose?.()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(7,7,13,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: 440, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="label" style={{ marginBottom: 4 }}>New Game</div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Challenge a Player</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label className="label">Opponent Address</label>
          <input
            className="input input-mono"
            placeholder="init1..."
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label className="label">Time Control</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {TIME_CONTROLS.map((tc) => (
              <button
                key={tc.ms}
                onClick={() => setTimeControl(tc)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--r-md)',
                  border: `1px solid ${timeControl.ms === tc.ms ? 'var(--accent)' : 'var(--border)'}`,
                  background: timeControl.ms === tc.ms ? 'rgba(124,58,237,0.15)' : 'var(--bg-elevated)',
                  color: timeControl.ms === tc.ms ? 'var(--accent-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700 }}>{tc.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{tc.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label">Wager ({import.meta.env.VITE_NATIVE_SYMBOL})</label>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => openBridge?.({ srcChainId: 'initiation-2', srcDenom: 'uinit' })}
            >
              🌉 Bridge Funds
            </button>
          </div>
          <input
            className="input input-mono"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={wager}
            onChange={(e) => setWager(e.target.value)}
          />
          {parseFloat(wager) > 0 && (
            <div style={{ fontSize: 12, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
              ♛ Winner takes {(parseFloat(wager) * 2).toFixed(2)} {import.meta.env.VITE_NATIVE_SYMBOL}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!opponent || creating}
          >
            {creating ? 'Creating...' : '♟ Challenge'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
