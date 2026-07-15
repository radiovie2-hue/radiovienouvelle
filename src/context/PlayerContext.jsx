import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'

const PlayerContext = createContext(null)

const STREAM_URL = 'https://play.radioking.io/radiovienouvelle'
// Lien final vérifié depuis la page Smart Link de RadioKing

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentShow, setCurrentShow] = useState('Radio Vie Nouvelle')

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audio.volume = volume
    audioRef.current = audio

    audio.addEventListener('waiting', () => setIsLoading(true))
    audio.addEventListener('playing', () => {
      setIsLoading(false)
      setError(null)
    })
    audio.addEventListener('error', () => {
      setError('Connexion perdue. Réessayez.')
      setIsPlaying(false)
      setIsLoading(false)
    })

    // Media Session API for lock screen controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'En Direct',
        artist: 'Radio Vie Nouvelle',
        album: 'FM 107.8 — Fréquence de Vie',
      })
      navigator.mediaSession.setActionHandler('play', () => play())
      navigator.mediaSession.setActionHandler('pause', () => pause())
    }

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setIsLoading(true)
    setError(null)
    audio.src = STREAM_URL
    audio.load()
    audio.play().then(() => {
      setIsPlaying(true)
      setIsLoading(false)
    }).catch((e) => {
      setError('Impossible de lire le flux.')
      setIsLoading(false)
    })
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = ''
    setIsPlaying(false)
    setIsLoading(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const changeVolume = useCallback((v) => {
    const val = Math.max(0, Math.min(1, v))
    setVolume(val)
    if (audioRef.current) audioRef.current.volume = val
  }, [])

  return (
    <PlayerContext.Provider value={{
      isPlaying,
      isLoading,
      volume,
      error,
      currentShow,
      setCurrentShow,
      togglePlay,
      play,
      pause,
      changeVolume,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer must be used within PlayerProvider')
  return context
}
