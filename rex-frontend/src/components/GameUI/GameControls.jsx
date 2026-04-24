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

      <button
        onClick={onToggleAutoSign}
        style={{
          width: '100%',
          height: 38,
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: isAutoSignEnabled ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
          color: isAutoSignEnabled ? 'var(--accent-light)' : 'var(--text-muted)',
          fontSize: 12,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: isAutoSignEnabled ? 'var(--accent-light)' : '#444',
          boxShadow: isAutoSignEnabled ? '0 0 10px var(--accent-light)' : 'none'
        }} />
        {isAutoSignEnabled ? 'Session Signed' : 'Sign Session (One-Click)'}
      </button>

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
