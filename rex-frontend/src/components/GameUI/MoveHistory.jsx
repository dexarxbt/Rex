import { useRef, useEffect } from 'react'

export function MoveHistory({ moves, currentMoveIndex, onMoveClick }) {
  const endRef = useRef()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [moves])

  if (!moves?.length) return (
    <div style={{ color: 'var(--text-faint)', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
      No moves yet
    </div>
  )

  const rows = []
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
      whiteIdx: i,
      blackIdx: i + 1,
    })
  }

  return (
    <div className="move-list">
      {rows.map((row) => (
        <div key={row.num} className="move-row">
          <span className="move-num">{row.num}.</span>
          <span
            className={`move-white ${currentMoveIndex === row.whiteIdx ? 'current' : ''}`}
            onClick={() => onMoveClick?.(row.whiteIdx)}
            style={{ cursor: onMoveClick ? 'pointer' : 'default' }}
          >
            {row.white?.san}
          </span>
          <span
            className={`move-black ${currentMoveIndex === row.blackIdx ? 'current' : ''}`}
            onClick={() => row.black && onMoveClick?.(row.blackIdx)}
            style={{ cursor: onMoveClick && row.black ? 'pointer' : 'default' }}
          >
            {row.black?.san || ''}
          </span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
