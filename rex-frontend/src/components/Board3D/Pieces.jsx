import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Chess } from 'chess.js'
import { useGameStore } from '../../store/gameStore'

function createLathe(points) {
  return new THREE.LatheGeometry(points.map(p => new THREE.Vector2(p[0], p[1])), 32)
}

// Staunton style profiles
const base = [[0,0], [0.4,0], [0.4,0.1], [0.35,0.12], [0.3,0.15], [0.25,0.2]]
const pawnGeo = createLathe([...base, [0.15,0.5], [0.2,0.55], [0.15,0.6], [0.22,0.75], [0,0.85]])
const rookGeo = createLathe([...base, [0.2,0.6], [0.25,0.65], [0.25,0.8], [0.15,0.8], [0.15,0.7], [0,0.7]])

// Knight shape extruded
const horseShape = new THREE.Shape()
horseShape.moveTo(-0.15, 0.2)
horseShape.lineTo(-0.2, 0.5)
horseShape.quadraticCurveTo(-0.25, 0.7, -0.1, 0.8)
horseShape.lineTo(0.15, 0.9)
horseShape.lineTo(0.25, 0.7)
horseShape.lineTo(0.15, 0.6)
horseShape.lineTo(0.2, 0.4)
horseShape.lineTo(0.15, 0.2)
horseShape.lineTo(-0.15, 0.2)

const knightExtrude = new THREE.ExtrudeGeometry(horseShape, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 })
knightExtrude.translate(0, 0, -0.08) // center depth
const knightBaseGeo = createLathe([...base, [0.15, 0.2]])

const bishopGeo = createLathe([...base, [0.15,0.6], [0.2,0.65], [0.15,0.7], [0.2,0.9], [0,1.05]])
const queenGeo = createLathe([...base, [0.18,0.7], [0.25,0.75], [0.15,0.8], [0.3,1.1], [0,1.0]])
const kingGeo = createLathe([...base, [0.2,0.75], [0.28,0.8], [0.18,0.85], [0.25,1.1], [0.1,1.15], [0.1,1.3], [0,1.3]])

const geos = { p: pawnGeo, r: rookGeo, b: bishopGeo, q: queenGeo, k: kingGeo }

function Piece({ type, color, position, square }) {
  const selectedSquare = useGameStore((state) => state.selectedSquare)
  const isSelected = selectedSquare === square
  const isKnight = type.toLowerCase() === 'n'
  
  return (
    <group position={[position[0], 0.1, position[2]]}>
      {isKnight ? (
        <group>
          <mesh castShadow geometry={knightBaseGeo}>
            <meshStandardMaterial color={color === 'w' ? '#f8fafc' : '#2a313d'} roughness={color === 'w' ? 0.15 : 0.25} metalness={color === 'w' ? 0.4 : 0.6} envMapIntensity={color === 'b' ? 2 : 1.2} emissive={isSelected ? '#eab308' : '#000000'} emissiveIntensity={isSelected ? 2 : 0} />
          </mesh>
          <mesh castShadow geometry={knightExtrude} rotation={[0, color === 'w' ? Math.PI / 2 : -Math.PI / 2, 0]}>
            <meshStandardMaterial color={color === 'w' ? '#f8fafc' : '#2a313d'} roughness={color === 'w' ? 0.15 : 0.25} metalness={color === 'w' ? 0.4 : 0.6} envMapIntensity={color === 'b' ? 2 : 1.2} emissive={isSelected ? '#eab308' : '#000000'} emissiveIntensity={isSelected ? 2 : 0} />
          </mesh>
        </group>
      ) : (
        <mesh castShadow geometry={geos[type.toLowerCase()]}>
          <meshStandardMaterial 
            color={color === 'w' ? '#f8fafc' : '#2a313d'} 
            roughness={color === 'w' ? 0.15 : 0.25}
            metalness={color === 'w' ? 0.4 : 0.6}
            envMapIntensity={color === 'b' ? 2 : 1.2}
            emissive={isSelected ? '#eab308' : '#000000'}
            emissiveIntensity={isSelected ? 2 : 0}
          />
        </mesh>
      )}
    </group>
  )
}

export function Pieces({ fen }) {
  const pieces = []
  if (!fen) return null
  
  let chessInst
  try {
    chessInst = new Chess(fen)
  } catch(e) {
    chessInst = new Chess()
  }

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const squareName = `${String.fromCharCode(97 + file)}${rank + 1}`
      const piece = chessInst.get(squareName)
      
      if (piece) {
        pieces.push(
          <Piece 
            key={squareName}
            type={piece.type}
            color={piece.color}
            square={squareName}
            position={[file - 3.5, 0, 3.5 - rank]}
          />
        )
      }
    }
  }

  return <group>{pieces}</group>
}
