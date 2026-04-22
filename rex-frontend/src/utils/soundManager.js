const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

export function playMoveSound(type = 'move') {
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  if (type === 'capture') {
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1)
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)
  } else {
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05)
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)
  }

  oscillator.start()
  oscillator.stop(audioCtx.currentTime + 0.2)
}
