import React from 'react'
import { usePlayer } from '../context/PlayerContext'
import { Calendar, Headphones, HeartPulse, Mic2, Pause, Play } from 'lucide-react'
import heroRadioImg from '../../image/ChatGPT Image 6 juil. 2026, 09_59_13.png'
import './HeroSection.css'

export default function HeroSection({ onScrollToShows }) {
  const { isPlaying, togglePlay, isLoading } = usePlayer()

  return (
    <section className="hero">
      {/* Immersive background auroras */}
      <div className="hero__aurora hero__aurora--1"></div>
      <div className="hero__aurora hero__aurora--2"></div>
      <div className="hero__aurora hero__aurora--3"></div>

      <div className="hero__container container">
        <div className="hero__content">
          <div className="hero__eyebrow reveal visible">
            <span className="live-dot live-dot--pulse"></span>
            <span className="hero__eyebrow-text">EN DIRECT</span>
            <span className="hero__eyebrow-separator"></span>
            <span className="hero__eyebrow-note">FM 107.8</span>
          </div>

          <h1 className="hero__title reveal visible reveal-delay-1">
            La Fréquence de <span className="text-gradient">Vie</span>
          </h1>

          <p className="hero__description reveal visible reveal-delay-2">
            Louange, enseignements bibliques et paroles d'espérance en continu.
            Radio Vie Nouvelle accompagne votre journée avec une présence profonde et vivante.
          </p>

          <div className="hero__actions reveal visible reveal-delay-3">
            <button className="hero__btn hero__btn--primary" onClick={togglePlay} disabled={isLoading}>
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              {isPlaying ? 'Mettre en pause' : 'Écouter Direct (107.8)'}
            </button>
            <button className="hero__btn hero__btn--ghost" onClick={onScrollToShows}>
              <Calendar size={18} />
              Grille des Émissions
            </button>
          </div>

          <div className="hero__highlights reveal visible reveal-delay-4">
            <div className="highlight-item">
              <Headphones size={16} className="highlight-icon" />
              <span>Direct 24h/24</span>
            </div>
            <div className="highlight-item">
              <Mic2 size={16} className="highlight-icon" />
              <span>Messages inspirants</span>
            </div>
            <div className="highlight-item">
              <HeartPulse size={16} className="highlight-icon" />
              <span>Foi et vie</span>
            </div>
          </div>
        </div>

        <div className="hero__visual reveal visible">
          <div className="hero__image-wrapper">
            {/* Main Image Card */}
            <div className="hero__image-card">
              <img
                src="/image/a34fe4be-c10e-48ee-a5f4-5a185879b852.png"
                alt="Auditrice de Radio Vie Nouvelle"
                className="hero__main-img"
                onError={(e) => {
                  e.target.src = '/image/416ea9f9-4c40-44b0-bcef-151a16726a2f.png'
                }}
              />
              <div className="hero__image-overlay"></div>
            </div>
            
            {/* Freely Floating Radio overlapping the woman's image */}
            <div className="hero__floating-radio">
              <img src={heroRadioImg} alt="Radio" className="hero__radio-img" style={{ mixBlendMode: 'multiply' }} />
            </div>

            {/* Floating Player Banner */}
            <div 
              className={`hero__player-banner ${isPlaying ? 'hero__player-banner--playing' : ''}`} 
              onClick={togglePlay}
            >
              <div className="player-banner__content">
                <div className="player-banner__icon">
                  {isPlaying ? (
                    <div className="audio-bars">
                      <span></span><span></span><span></span>
                    </div>
                  ) : (
                    <Play size={20} fill="currentColor" />
                  )}
                </div>
                <div className="player-banner__text">
                  <span className="player-banner__title">Écoutez <span className="text-gold">en direct</span></span>
                  <span className="player-banner__subtitle">À l'antenne : Radio Vie Nouvelle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
