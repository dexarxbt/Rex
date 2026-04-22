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
