import { useUsernameQuery } from '@initia/interwovenkit-react'
import { motion } from 'framer-motion'

function PlayerRow({ rank, address, elo, wins, losses, index }) {
  const { data: username } = useUsernameQuery(address)
  const displayName = username || `${address?.slice(0,8)}...${address?.slice(-4)}`
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0

  const medals = ['♚', '♛', '♜']
  const isTop = rank <= 3

  return (
    <motion.div
      className="lb-row"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className={`lb-rank ${isTop ? 'top-3' : ''}`}>
        {isTop ? medals[rank-1] : rank}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-fancy)' }}>{displayName}</div>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: 'var(--text-faint)' }}>
          {wins}W {losses}L
        </div>
      </div>
      <div className="badge badge-leaderboard" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        {elo}
      </div>
      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: winRate >= 50 ? 'var(--success)' : 'var(--text-muted)', textAlign: 'right' }}>
        {winRate}%
      </div>
    </motion.div>
  )
}

export function Leaderboard({ players = [] }) {
  if (!players.length) return (
    <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '40px 0' }}>
      No players yet. Be the first!
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="lb-row" style={{ padding: '6px 16px' }}>
        <div className="label">#</div>
        <div className="label">Player</div>
        <div className="label">ELO</div>
        <div className="label" style={{ textAlign: 'right' }}>Win%</div>
      </div>
      <hr className="divider" style={{ margin: '4px 0' }} />

      {players.map((p, i) => (
        <PlayerRow
          key={p.address}
          rank={i + 1}
          index={i}
          {...p}
        />
      ))}
    </div>
  )
}
