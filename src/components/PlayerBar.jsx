import { usePlayer } from '../context/PlayerContext'
import { Play, Pause, Volume2, VolumeX, Loader2, Radio } from 'lucide-react'
import { useState, useEffect } from 'react'
import './PlayerBar.css'

export default function PlayerBar() {
  const {
    isPlaying,
    isLoading,
    volume,
    error,
    currentShow,
    togglePlay,
    changeVolume,
  } = usePlayer()

  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(volume)

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value)
    changeVolume(newVol)
    if (newVol > 0) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      changeVolume(prevVolume > 0 ? prevVolume : 0.8)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      changeVolume(0)
      setIsMuted(true)
    }
  }

  return (
    <div className="player-bar">
      <div className="player-bar__inner container">
        {/* Error Message */}
        {error && <div className="player-bar__error">{error}</div>}

        {/* Left: Info */}
        <div className="player-bar__info">
          <div className={`player-bar__avatar ${isPlaying ? 'player-bar__avatar--spinning' : ''}`}>
            <Radio size={20} className="player-bar__icon-radio" />
          </div>
          <div className="player-bar__details">
            <div className="player-bar__meta">
              <span className="player-bar__live-badge">
                <span className="live-dot"></span> EN DIRECT
              </span>
              {isPlaying && (
                <div className="player-bar__eq">
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                </div>
              )}
            </div>
            <h4 className="player-bar__title">{currentShow || 'Radio Vie Nouvelle'}</h4>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="player-bar__controls">
          <button
            className={`player-bar__play-btn ${isPlaying ? 'player-bar__play-btn--active' : ''}`}
            onClick={togglePlay}
            disabled={isLoading}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="play-icon-offset" />
            )}
          </button>
        </div>

        {/* Right: Volume */}
        <div className="player-bar__volume">
          <button className="player-bar__volume-btn" onClick={toggleMute} aria-label="Mute/Unmute">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="player-bar__volume-slider"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  )
}
