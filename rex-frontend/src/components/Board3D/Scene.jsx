import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  Float 
} from '@react-three/drei'
import { EffectComposer, Bloom, SSAO, Vignette } from '@react-three/postprocessing'
import { Board } from './Board'
import { Pieces } from './Pieces'
import { CameraManager } from './CameraManager'

export function Scene({ fen, onSquareClick, selectedSquare, legalMoves, interactive = true }) {
  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: interactive ? 'auto' : 'none' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 8, 10]} fov={50} />
          <CameraManager />
          <OrbitControls 
            makeDefault
            enableDamping 
            dampingFactor={0.05} 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={5} 
            maxDistance={20} 
            enabled={interactive}
          />

          {/* Environment & Lighting */}
          {/* <color attach="background" args={['#020617']} /> removed for transparency */}
          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]} 
          />
          <pointLight position={[-10, 5, -10]} intensity={2} color="#3b82f6" />
          <pointLight position={[10, 5, 10]} intensity={2} color="#f59e0b" />

          {/* Game World */}
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <group rotation={[-0.1, 0, 0]}>
              <Board onSquareClick={onSquareClick} selectedSquare={selectedSquare} legalMoves={legalMoves} />
              <Pieces fen={fen} />
            </group>
          </Float>

          <ContactShadows 
            position={[0, -0.2, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
          />

          {/* Post Processing */}
          <EffectComposer>
            <SSAO intensity={20} radius={0.1} luminanceInfluence={0.5} />
            <Bloom 
              intensity={0.5} 
              luminanceThreshold={0.8} 
              luminanceSmoothing={0.9} 
              height={300} 
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
