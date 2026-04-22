import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInterwovenKit } from '@initia/interwovenkit-react'

function TournamentCard({ tournament, onJoin, onStart, myAddress }) {
  const isCreator = tournament.creator === myAddress
  const isFull = tournament.players.length >= tournament.max_players
  const isIn = tournament.players.some(p => p.addr === myAddress)

  return (
    <motion.div
      className="card"
      whileHover={{ borderColor: 'rgba(124,58,237,0.35)' }}
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-fancy)' }}>Tournament #{tournament.id}</div>
          <div style={{ fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', marginTop: 2 }}>
            {tournament.time_control_ms / 60000}min • {tournament.max_players} players max
          </div>
        </div>
        <span className={`badge ${tournament.status === 0 ? 'badge-waiting' : 'badge-tournament'}`}>
          {tournament.status === 0 ? 'Open' : 'Live'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Entry', value: `${(tournament.entry_fee / 1e6).toFixed(1)} ${import.meta.env.VITE_NATIVE_SYMBOL}` },
          { label: 'Prize Pool', value: `${(tournament.prize_pool / 1e6).toFixed(1)} ${import.meta.env.VITE_NATIVE_SYMBOL}` },
          { label: 'Players', value: `${tournament.players.length}/${tournament.max_players}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px' }}>
            <div className="label" style={{ marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-elevated)', borderRadius: 99, height: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(tournament.players.length / tournament.max_players) * 100}%`,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
          transition: 'width 0.5s ease',
        }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!isIn && !isFull && tournament.status === 0 && (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onJoin(tournament.id)}>
            Join Tournament
          </button>
        )}
        {isIn && tournament.status === 0 && (
          <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            ✓ Registered
          </div>
        )}
        {isCreator && tournament.status === 0 && tournament.players.length >= 2 && (
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => onStart(tournament.id)}>
            Start Tournament
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function TournamentLobby({ tournaments = [], onCreate, onJoin, onStart }) {
  const { initiaAddress } = useInterwovenKit()
  const [showCreate, setShowCreate] = useState(false)
  const [entryFee, setEntryFee] = useState('1')
  const [maxPlayers, setMaxPlayers] = useState('4')
  const [timeControl] = useState(300000)

  const handleCreate = () => {
    onCreate({
      entry_fee: Math.floor(parseFloat(entryFee) * 1e6),
      max_players: parseInt(maxPlayers),
      time_control_ms: timeControl,
    })
    setShowCreate(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-fancy)' }}>Tournaments</h2>
          <div style={{ fontSize: 14, fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', marginTop: 2 }}>
            Compete for the prize pool
          </div>
        </div>
        <button className="btn btn-gold" onClick={() => setShowCreate(!showCreate)}>
          + Create Tournament
        </button>
      </div>

      {showCreate && (
        <motion.div
          className="card-gold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <h3 style={{ fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-fancy)', fontSize: 20 }}>New Tournament</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Entry Fee ({import.meta.env.VITE_NATIVE_SYMBOL})</label>
              <input className="input input-mono" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Max Players</label>
              <select
                className="input"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
              >
                {[2, 4, 8, 16].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-gold" onClick={handleCreate}>Create</button>
          </div>
        </motion.div>
      )}

      {!tournaments.length ? (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '40px 0' }}>
          No tournaments yet. Create one!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tournaments.map((t) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              onJoin={onJoin}
              onStart={onStart}
              myAddress={initiaAddress}
            />
          ))}
        </div>
      )}
    </div>
  )
}
