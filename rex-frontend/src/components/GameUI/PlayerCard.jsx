import { useUsernameQuery } from '@initia/interwovenkit-react'
import { motion } from 'framer-motion'

function truncate(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 8)}...${addr.slice(-4)}`
}

function Clock({ ms, isActive }) {
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  const isLow = ms < 30000 && ms > 0
  return (
    <div className={`clock ${isActive ? 'active' : ''} ${isLow ? 'low-time' : ''}`}>
      {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
    </div>
  )
}

export function PlayerCard({ address, timeMs, isActive, isWhite, wager, isYou }) {
  const { data: username } = useUsernameQuery(address)
  const displayName = username || truncate(address) || (isWhite ? 'White Player' : 'Black Player')

  return (
    <motion.div
      className="card"
      animate={{
        borderColor: isActive ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.15)',
        boxShadow: isActive ? '0 0 24px rgba(124,58,237,0.2)' : '0 4px 16px rgba(0,0,0,0.5)',
      }}
      transition={{ duration: 0.3 }}
      style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Color dot */}
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: isWhite
            ? 'radial-gradient(circle at 35% 30%, #fff8f0, #c8b898)'
            : 'radial-gradient(circle at 35% 30%, #3a1560, #0a0018)',
          border: isWhite ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(168,85,247,0.4)',
          boxShadow: isWhite ? '0 0 8px rgba(255,255,255,0.2)' : '0 0 8px rgba(124,58,237,0.4)',
          flexShrink: 0,
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {displayName}
            </span>
            {isYou && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: 'var(--accent-light)',
                background: 'rgba(124,58,237,0.15)',
                padding: '1px 7px', borderRadius: 99,
                letterSpacing: '0.06em', textTransform: 'uppercase'
              }}>you</span>
            )}
          </div>
          {wager > 0 && (
            <div className="badge-wager" style={{ marginTop: 3, fontSize: 11 }}>
              ♛ {(wager / 1e6).toFixed(2)} {import.meta.env.VITE_NATIVE_SYMBOL}
            </div>
          )}
        </div>
      </div>

      <Clock ms={timeMs || 300000} isActive={isActive} />
    </motion.div>
  )
}
