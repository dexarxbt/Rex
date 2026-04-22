import React from 'react'
import { useGameStore } from '../../store/gameStore'

export function Board({ onSquareClick, selectedSquare, legalMoves = [] }) {
  const squares = []
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = `${String.fromCharCode(97 + file)}${rank + 1}`
      const isDark = (rank + file) % 2 === 0
      const isSelected = selectedSquare === square
      const isValidMove = legalMoves.includes(square)

      squares.push(
        <mesh 
          key={square} 
          position={[file - 3.5, 0, 3.5 - rank]} 
          receiveShadow
          onClick={(e) => {
            e.stopPropagation()
            if (onSquareClick) onSquareClick(square)
          }}
        >
          <boxGeometry args={[1, 0.2, 1]} />
          <meshStandardMaterial 
            color={isSelected ? '#eab308' : isValidMove ? '#84cc16' : isDark ? '#111827' : '#f9fafb'} 
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      )
    }
  }

  return <group>{squares}</group>
}
