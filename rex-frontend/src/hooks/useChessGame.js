import { useState, useCallback, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import { useInterwovenKit } from '@initia/interwovenkit-react'
import { AccAddress, RESTClient } from '@initia/initia.js'
import { MsgExecute } from '@initia/initia.proto/initia/move/v1/tx'
import { useGameStore } from '../store/gameStore'
import { motion } from 'framer-motion'

const CHAIN_ID      = import.meta.env.VITE_APPCHAIN_ID || 'rex-1'
const MODULE_ADDR   = import.meta.env.VITE_MODULE_ADDRESS || '0x1'
const REGISTRY_ADDR = import.meta.env.VITE_REGISTRY_ADDRESS || '0x1'
const REST_URL      = import.meta.env.VITE_INITIA_REST_URL || 'http://localhost:1317'

const rest = new RESTClient(REST_URL, { chainId: CHAIN_ID })
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function encodeU64(n) {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64LE(BigInt(n))
  return buf.toString('base64')
}

export function useChessGame() {
  const { initiaAddress, requestTxSync, autoSign } = useInterwovenKit()
  const [chess] = useState(() => new Chess())
  const pollRef = useRef(null)

  const {
    gameId, fen, gameStatus,
    whiteAddress, blackAddress,
    selectedSquare, legalMoves,
    pendingMove, isCheckmate,
    setFen, setGameStatus, setPlayers,
    setMoveHistory, setLastMove,
    setSelectedSquare, setLegalMoves,
    setCaptureSquare, setCheckSquare,
    setIsCheckmate, setPendingMove,
    setGameId, setView,
  } = useGameStore()

  const isAutoSignEnabled = Boolean(autoSign?.isEnabledByChain?.[CHAIN_ID])

  const fetchGameState = useCallback(async (gId) => {
    if (!gId && gId !== 0) return
    if (gId === 'bot') return
    try {
      const moduleHex = AccAddress.toHex(MODULE_ADDR)
      
      const [white, black, newFen, moves, status] = await rest.move.viewFunction(
        moduleHex,
        'chess',
        'get_game',
        [],
        [`"${REGISTRY_ADDR}"`, JSON.stringify(gId)]
      )

      chess.load(newFen)
      setFen(newFen)
      setGameStatus(status)
      setPlayers(white, black)
      setMoveHistory(moves.map(m => ({ san: m })))

    } catch (err) {
      console.error('fetchGameState error:', err)
    }
  }, [chess, setFen, setGameStatus, setPlayers, setMoveHistory])

  const submitMove = useCallback(async (moveNotation, newFen) => {
    if (gameId === 'bot') return
    setPendingMove(true)
    try {
      await requestTxSync({
        chainId: CHAIN_ID,
        autoSign: isAutoSignEnabled,
        feeDenom: isAutoSignEnabled ? import.meta.env.VITE_NATIVE_DENOM : undefined,
        messages: [{
          typeUrl: '/initia.move.v1.MsgExecute',
          value: MsgExecute.fromPartial({
            sender: initiaAddress,
            moduleAddress: MODULE_ADDR,
            moduleName: 'chess',
            functionName: 'make_move',
            typeArgs: [],
            args: [
              encodeU64(gameId),
              Buffer.from(moveNotation).toString('base64'),
              Buffer.from(newFen).toString('base64'),
              encodeU64(100),
            ],
          }),
        }],
      })

      await sleep(2000)
      await fetchGameState(gameId)
    } catch (err) {
      console.error('submitMove error:', err)
      chess.undo()
      setFen(chess.fen())
      setMoveHistory(chess.history({ verbose: true }).map(m => ({ san: m.san })))
    } finally {
      setPendingMove(false)
    }
  }, [gameId, initiaAddress, isAutoSignEnabled, requestTxSync, fetchGameState, chess, setFen, setPendingMove])

  const selectPiece = useCallback((square) => {
    const piece = chess.get(square)
    if (!piece) { setSelectedSquare(null); setLegalMoves([]); return }

    const isWhitePiece = piece.color === 'w'
    const amWhite = whiteAddress === initiaAddress
    const amBlack = blackAddress === initiaAddress
    const isWhiteTurn = chess.turn() === 'w'
    
    if (whiteAddress && blackAddress) {
      if (isWhiteTurn && (!isWhitePiece || !amWhite)) return
      if (!isWhiteTurn && (isWhitePiece || !amBlack)) return
    }

    setSelectedSquare(square)
    const moves = chess.moves({ square, verbose: true }).map(m => m.to)
    setLegalMoves([...new Set(moves)])
  }, [chess, whiteAddress, blackAddress, initiaAddress, setSelectedSquare, setLegalMoves])

  const handleSquareClick = useCallback((square) => {
    if (pendingMove || (gameStatus !== null && gameStatus !== 'active')) return 

    const isWhiteTurn = chess.turn() === 'w'
    const amWhite = whiteAddress === initiaAddress
    const amBlack = blackAddress === initiaAddress

    if (whiteAddress && blackAddress) {
      if ((isWhiteTurn && !amWhite) || (!isWhiteTurn && !amBlack)) return
    }

    if (selectedSquare) {
      try {
        const piece = chess.get(selectedSquare)
        const isPromotion = piece && piece.type === 'p' && (
          (piece.color === 'w' && square[1] === '8') ||
          (piece.color === 'b' && square[1] === '1')
        )
        
        let prom = 'q'
        if (isPromotion) {
          prom = window.prompt("Promote to: q (Queen), r (Rook), b (Bishop), n (Knight)", "q") || "q"
          if (!['q', 'r', 'b', 'n'].includes(prom.toLowerCase())) prom = 'q'
        }

        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: prom.toLowerCase(),
        })

        if (move) {
          if (move.captured) {
            setCaptureSquare(square)
            setTimeout(() => setCaptureSquare(null), 1200)
          }

          if (chess.isCheck()) {
            const board = chess.board()
            let kingSq = null
            for (let r = 0; r < 8; r++) {
              for (let f = 0; f < 8; f++) {
                const p = board[r][f]
                if (p && p.type === 'k' && p.color === chess.turn()) {
                  kingSq = `${String.fromCharCode(97+f)}${8-r}`
                }
              }
            }
            setCheckSquare(kingSq)
            if (chess.isCheckmate()) setIsCheckmate(true)
          } else {
            setCheckSquare(null)
            setIsCheckmate(false)
          }

          setLastMove({ from: selectedSquare, to: square })
          setFen(chess.fen())
          setMoveHistory(chess.history({ verbose: true }).map(m => ({ san: m.san })))
          setSelectedSquare(null)
          setLegalMoves([])

          submitMove(move.san, chess.fen())
          return
        }
      } catch (e) {
        console.warn('Invalid move:', e)
      }
      selectPiece(square)
    } else {
      selectPiece(square)
    }
  }, [selectedSquare, pendingMove, gameStatus, chess, initiaAddress, whiteAddress, blackAddress, selectPiece, setCaptureSquare, setCheckSquare, setFen, setIsCheckmate, setLastMove, setLegalMoves, setSelectedSquare, submitMove])

  useEffect(() => {
    if (gameId === null) return
    fetchGameState(gameId)
    pollRef.current = setInterval(() => {
      if (!useGameStore.getState().pendingMove) {
        fetchGameState(gameId)
      }
    }, 3000)
    return () => clearInterval(pollRef.current)
  }, [gameId, fetchGameState])

  const resign = async () => {
    await requestTxSync({
      chainId: CHAIN_ID,
      messages: [{
        typeUrl: '/initia.move.v1.MsgExecute',
        value: MsgExecute.fromPartial({
          sender: initiaAddress,
          moduleAddress: MODULE_ADDR,
          moduleName: 'chess',
          functionName: 'resign_game',
          typeArgs: [],
          args: [
            encodeU64(gameId),
          ],
        }),
      }],
    })
    await sleep(2000)
    await fetchGameState(gameId)
  }

  const createGame = async (opponentAddress, wager, timeControlMs) => {
    await requestTxSync({
      chainId: CHAIN_ID,
      messages: [{
        typeUrl: '/initia.move.v1.MsgExecute',
        value: MsgExecute.fromPartial({
          sender: initiaAddress,
          moduleAddress: MODULE_ADDR,
          moduleName: 'chess',
          functionName: 'create_game',
          typeArgs: [],
          args: [
            Buffer.from(opponentAddress).toString('base64'),
            Buffer.from('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').toString('base64'),
            encodeU64(wager),
            encodeU64(timeControlMs),
          ],
        }),
      }],
    })
  }

  const toggleAutoSign = async () => {
    if (isAutoSignEnabled) {
      await autoSign?.disable(CHAIN_ID)
    } else {
      await autoSign?.enable(CHAIN_ID)
    }
  }

  return {
    chess,
    fen,
    gameStatus,
    selectedSquare,
    legalMoves,
    pendingMove,
    isCheckmate,
    isAutoSignEnabled,
    handleSquareClick,
    submitMove,
    resign,
    createGame,
    toggleAutoSign,
    fetchGameState,
  }
}
