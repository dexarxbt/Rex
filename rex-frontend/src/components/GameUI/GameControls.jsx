import { useState } from 'react'
import { motion } from 'framer-motion'

export function GameControls({ onResign, onOfferDraw, onToggleAutoSign, isAutoSignEnabled }) {
  const [showConfirm, setShowConfirm] = useState(null)

  const handleResign = () => {
    if (showConfirm === 'resign') {
      onResign()
      setShowConfirm(null)
    } else {
      setShowConfirm('resign')
    }
  }

  const handleDraw = () => {
    if (showConfirm === 'draw') {
      onOfferDraw()
      setShowConfirm(null)
    } else {
      setShowConfirm('draw')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: isAutoSignEnabled ? 'rgba(124,58,237,0.12)' : 'var(--bg-elevated)',
          borderRadius: 'var(--r-md)',
          border: `1px solid ${isAutoSignEnabled ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={onToggleAutoSign}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: isAutoSignEnabled ? 'var(--accent-light)' : 'var(--text-muted)' }}>
            ⚡ Auto-Sign
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
            {isAutoSignEnabled ? 'Moves submit instantly' : 'Wallet approval required'}
          </div>
        </div>
        <div style={{
          width: 36, height: 20, borderRadius: 99,
          background: isAutoSignEnabled ? 'var(--accent)' : 'var(--bg-card)',
          border: '2px solid var(--border)',
          position: 'relative', transition: 'background 0.2s',
        }}>
          <div style={{
            position: 'absolute',
            top: 2, left: isAutoSignEnabled ? 16 : 2,
            width: 12, height: 12, borderRadius: '50%',
            background: 'white',
            transition: 'left 0.2s',
          }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleDraw}
        >
          {showConfirm === 'draw' ? '✓ Confirm' : '½ Draw'}
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleResign}
        >
          {showConfirm === 'resign' ? '✓ Resign?' : '⚑ Resign'}
        </button>
      </div>

      {showConfirm && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowConfirm(null)}
          style={{ width: '100%', fontSize: 11 }}
        >
          Cancel
        </button>
      )}
    </div>
  )
}
