import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

export function CameraManager() {
  const { camera, controls } = useThree()
  const currentView = useGameStore((state) => state.currentView)
  const whiteAddress = useGameStore((state) => state.whiteAddress)
  const initiaAddress = useGameStore((state) => state.initiaAddress)
  
  const targetPos = useRef(new THREE.Vector3(5, 8, 10))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))
  const transitioning = useRef(false)

  useEffect(() => {
    transitioning.current = true
    if (currentView === 'game') {
      const amWhite = whiteAddress === initiaAddress || initiaAddress === null
      const zPos = amWhite ? 11 : -11
      targetPos.current.set(0, 9, zPos)
      targetLook.current.set(0, 0, 0)
    } else if (currentView === 'landing') {
      targetPos.current.set(8, 6, 12)
      targetLook.current.set(-2, 0, 0)
    } else {
      targetPos.current.set(6, 8, 10)
      targetLook.current.set(0, 0, 0)
    }
  }, [currentView, whiteAddress, initiaAddress])

  useFrame((state, delta) => {
    if (transitioning.current) {
      const speed = 3.5
      camera.position.lerp(targetPos.current, delta * speed)
      
      if (controls) {
        controls.target.lerp(targetLook.current, delta * speed)
      } else {
        camera.lookAt(targetLook.current)
      }

      if (camera.position.distanceTo(targetPos.current) < 0.05) {
        transitioning.current = false
      }
    }

    if (controls) controls.update()

    // Subtle breathing only in non-game views
    if (currentView !== 'game') {
      const t = state.clock.getElapsedTime()
      camera.position.y += Math.sin(t * 0.4) * 0.002
    }
  })

  return null
}
