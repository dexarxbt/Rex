import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function sqToPos(sq) {
  const file = sq.charCodeAt(0) - 97
  const rank = parseInt(sq[1]) - 1
  return [(file - 3.5), 0.055, (rank - 3.5)]
}

function Dot({ square }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.material.opacity =
      0.55 + Math.sin(state.clock.elapsedTime * 3) * 0.2
  })

  const pos = sqToPos(square)

  return (
    <mesh ref={ref} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.18, 24]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={0.55}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function MoveIndicators({ squares = [] }) {
  return (
    <group>
      {squares.map((sq) => (
        <Dot key={sq} square={sq} />
      ))}
    </group>
  )
}
