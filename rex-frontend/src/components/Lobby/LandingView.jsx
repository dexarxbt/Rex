import React from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { Scene } from '../Board3D/Scene'
import { useInterwovenKit } from '@initia/interwovenkit-react'

// Custom Initia "I" Logo as provided in the image
const InitiaIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 20 C45 25, 45 40, 45 50 C45 60, 45 75, 40 80 L60 80 C55 75, 55 60, 55 50 C55 40, 55 25, 60 20 Z" fill="white"/>
  </svg>
)

export function LandingView() {
  const { setView } = useGameStore()
  const { initiaAddress } = useInterwovenKit()

  // No bot logic, purely visual


  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      
      {/* Background Cinematic Video Layer */}
      <video 
        src="/landing-ani.mp4" 
        autoPlay loop muted playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          opacity: 0.15,
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      />
      
      {/* Background Gradient to ensure dark sleek contrast */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(7,7,13,0.9) 0%, rgba(7,7,13,0.4) 50%, rgba(7,7,13,0.1) 100%)',
        zIndex: 1,
      }} />

      {/* Main Content Layout */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        height: '100%',
        width: '100%',
      }}>
        
        {/* LEFT PANEL - Typography & Call to Action (Glassmorphism) */}
        <div style={{
          flex: '0 0 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 8%',
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <InitiaIcon />
              <div style={{ height: 1, width: 40, background: 'var(--accent-glow)' }} />
              <span className="label" style={{ letterSpacing: '0.3em', fontFamily: 'var(--font-mono)' }}>INITIA NETWORK</span>
            </div>
            
            <h1 style={{ 
              fontFamily: 'var(--font-fancy)',
              fontSize: 'clamp(40px, 5vw, 76px)', 
              fontWeight: 900, 
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              marginBottom: 24,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}>
              THE KING'S <br />
              <span style={{ 
                background: 'var(--grad-royal)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px var(--accent-glow))'
              }}>
                GAME
              </span>
            </h1>
            
            <p style={{ 
              fontFamily: 'var(--font-sans)',
              fontSize: 18, 
              lineHeight: 1.6, 
              color: 'var(--text-muted)', 
              maxWidth: 440,
              marginBottom: 40,
            }}>
              Decentralized chess exclusively on the Initia appchain. Every wager verified, every checkmate permanently recorded. 
            </p>
            
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => setView('lobby')}
              >
                Enter Lobby
              </button>
              
              {!initiaAddress && (
                <button className="btn btn-ghost btn-lg" onClick={() => document.querySelector('.btn-primary')?.click()}>
                  Connect Wallet
                </button>
              )}
            </div>
            
            <div style={{ marginTop: 40, opacity: 0.6, fontSize: 13, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
              Live on Initia
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL - 3D Cinematic Board */}
        <div style={{
          flex: '1',
          position: 'relative',
        }}>
          {/* We wrap the scene so it plays exactly inside this flex area */}
          <div style={{ position: 'absolute', inset: '-10% -20% -10% -10%' }}> 
            <Scene 
              fen={'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'} 
              interactive={false} 
            />
          </div>
        </div>
        
      </div>
    </div>
  )
}
