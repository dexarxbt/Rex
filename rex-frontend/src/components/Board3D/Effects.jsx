import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function sqToPos(sq) {
  const file = sq.charCodeAt(0) - 97
  const rank = parseInt(sq[1]) - 1
  return [(file - 3.5), 0.1, (rank - 3.5)]
}

export function CaptureEffect({ square }) {
  const group = useRef()
  const startTime = useRef(Date.now())

  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      angle: (i / 20) * Math.PI * 2 + Math.random() * 0.3,
      speed: 0.04 + Math.random() * 0.06,
      ySpeed: 0.06 + Math.random() * 0.08,
      size: 0.03 + Math.random() * 0.04,
    }))
  , [square])

  const pos = square ? sqToPos(square) : [0, 0, 0]

  useFrame(() => {
    if (!group.current || !square) return
    const elapsed = (Date.now() - startTime.current) / 1000
    group.current.children.forEach((child, i) => {
      const p = particles[i]
      child.position.x = pos[0] + Math.cos(p.angle) * p.speed * elapsed * 8
      child.position.y = pos[1] + p.ySpeed * elapsed * 5 - 0.5 * 0.1 * elapsed * elapsed * 25
      child.position.z = pos[2] + Math.sin(p.angle) * p.speed * elapsed * 8
      child.material.opacity = Math.max(0, 1 - elapsed * 1.8)
    })
  })

  if (!square) return null

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[p.size, 4, 4]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#d4a853' : i % 3 === 1 ? '#a855f7' : '#ffffff'}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  )
}

export function CheckRing({ square }) {
  const mesh = useRef()

  useFrame((state) => {
    if (!mesh.current) return
    const s = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.12
    mesh.current.scale.set(s, s, s)
    mesh.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 6) * 0.3
  })

  if (!square) return null
  const pos = sqToPos(square)

  return (
    <mesh ref={mesh} position={[pos[0], 0.06, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.42, 0.52, 32]} />
      <meshBasicMaterial
        color="#ef4444"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function Effects({ captureSquare, checkSquare, isCheckmate }) {
  return (
    <group>
      {captureSquare && <CaptureEffect square={captureSquare} />}
      {checkSquare && !isCheckmate && <CheckRing square={checkSquare} />}
    </group>
  )
}
