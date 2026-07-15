import React from 'react'
import { Play, Calendar, Clock, Headphones, ImageIcon } from 'lucide-react'
import { usePodcasts } from '../hooks/usePodcasts'
import './PodcastsSection.css'

export default function PodcastsSection() {
  const { podcasts, loading } = usePodcasts({ limit: 3 })

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  return (
    <section className="podcasts-section" id="podcasts">
      <div className="container">
        {/* Section Header */}
        <div className="podcasts__header reveal visible">
          <div className="podcasts__subtitle">
            <Headphones size={16} className="text-gold" />
            <span>Replays & Podcasts</span>
          </div>
          <h2 className="podcasts__title">Derniers Podcasts</h2>
          <p className="podcasts__desc">
            Ne manquez rien ! Réécoutez vos émissions préférées, des enseignements inspirants et des moments de louange où que vous soyez.
          </p>
        </div>

        {/* Podcasts Grid */}
        <div className="podcasts__grid">
          {loading ? (
            // Skeleton Loaders
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="podcast-card podcast-card--skeleton reveal visible reveal-delay-1">
                <div className="podcast-card__image-container podcast-skeleton-block"></div>
                <div className="podcast-card__content">
                  <div className="podcast-skeleton-line podcast-skeleton-line--title"></div>
                  <div className="podcast-card__meta">
                    <div className="podcast-skeleton-line podcast-skeleton-line--meta"></div>
                    <div className="podcast-skeleton-line podcast-skeleton-line--meta"></div>
                  </div>
                  <div className="podcast-skeleton-line"></div>
                  <div className="podcast-skeleton-line podcast-skeleton-line--short"></div>
                </div>
              </div>
            ))
          ) : podcasts.length > 0 ? (
            podcasts.map((podcast, index) => (
              <div 
                key={podcast.id} 
                className={`podcast-card reveal visible reveal-delay-${(index % 3) + 1}`}
              >
                <div className="podcast-card__image-container">
                  {podcast.coverImage ? (
                    <img 
                      src={podcast.coverImage} 
                      alt={podcast.title} 
                      className="podcast-card__image"
                    />
                  ) : (
                    <div className="podcast-card__image-placeholder">
                      <ImageIcon size={48} className="text-tertiary" />
                    </div>
                  )}
                  <div className="podcast-card__overlay">
                    <button className="podcast-card__play-btn" aria-label="Écouter le podcast">
                      <Play size={24} fill="#000" />
                    </button>
                  </div>
                </div>

                <div className="podcast-card__content">
                  <h3 className="podcast-card__title" title={podcast.title}>
                    {podcast.title}
                  </h3>
                  
                  <div className="podcast-card__meta">
                    <div className="meta-item">
                      <Calendar size={14} className="text-gold" />
                      <span>{formatDate(podcast.date)}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} className="text-gold" />
                      <span>{podcast.duration}</span>
                    </div>
                  </div>

                  <p className="podcast-card__description">
                    {podcast.description}
                  </p>
                </div>
                <div className="podcast-card__bottom-line"></div>
              </div>
            ))
          ) : (
            <div className="podcasts__empty-state">
              <Headphones size={48} className="text-tertiary" />
              <p>Aucun podcast disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
