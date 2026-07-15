import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePrograms } from '../hooks/usePrograms'
import { usePlayer } from '../context/PlayerContext'
import { Clock, Calendar, User, Play, Music, Info, Award, Heart, ImageIcon, ArrowRight } from 'lucide-react'
import './ShowsGrid.css'

export default function ShowsGrid() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const { setCurrentShow, isPlaying, play } = usePlayer()

  const { programs: filteredShows, loading } = usePrograms({ category: activeCategory })

  const categories = ['Tous', 'Spirituel', 'Information', 'Musique', 'Jeunesse']

  const handleListenShow = (showName) => {
    setCurrentShow(showName)
    if (!isPlaying) {
      play()
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Spirituel': return <Heart size={14} />
      case 'Information': return <Info size={14} />
      case 'Musique': return <Music size={14} />
      case 'Jeunesse': return <Award size={14} />
      default: return null
    }
  }

  return (
    <section className="shows-section container section" id="shows-grid">
      <div className="section-title">
        <h2 className="text-gradient">Grille des Émissions</h2>
        <p>Retrouvez toute la richesse de nos programmes pour vous accompagner chaque jour de la semaine.</p>
        <span className="accent-line"></span>
      </div>

      {/* Category Tabs */}
      <div className="shows-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`shows-tab ${activeCategory === cat ? 'shows-tab--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {/* Shows Grid */}
      <div className="shows-grid">
        {loading ? (
          // Skeleton loading
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card show-card show-card--skeleton reveal visible">
              <div className="show-card__image-skeleton" />
              <div className="show-card__content-skeleton">
                <div className="skeleton-line skeleton-line--short" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--medium" />
              </div>
            </div>
          ))
        ) : (
          filteredShows.slice(0, 5).map(show => (
            <div key={show.id} className="glass-card show-card reveal visible">
              {/* Show Image Background */}
              <div className="show-card__bg-wrapper">
                {show.image ? (
                  <img
                    src={show.image}
                    alt={show.name}
                    className="show-card__bg-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="show-card__bg-placeholder">
                    <ImageIcon size={48} />
                    <span>{show.category}</span>
                  </div>
                )}
                <div className="show-card__gradient-overlay"></div>
              </div>

              <div className="show-card__content-wrapper">
                <div className="show-card__top">
                  <span className={`category-tag category-tag--${show.category.toLowerCase()}`}>
                    {show.category}
                  </span>
                </div>

                <div className="show-card__bottom">
                  <h3 className="show-card__title">{show.name}</h3>

                  <div className="show-card__meta">
                    <div className="show-card__meta-item">
                      <Clock size={14} className="text-gold" />
                      <span>{show.time}</span>
                    </div>
                    <div className="show-card__meta-item">
                      <User size={14} className="text-gold" />
                      <span><strong>{show.host}</strong></span>
                    </div>
                  </div>

                  <div className="show-card__hover-content">
                    <p className="show-card__description">{show.description}</p>

                    <div className="show-card__days">
                      <Calendar size={14} className="text-tertiary" />
                      <div className="show-card__days-list">
                        {show.days.join(', ')}
                      </div>
                    </div>

                    <button 
                      className="show-card__action"
                      onClick={() => handleListenShow(show.name)}
                    >
                      <Info size={16} />
                      En savoir plus sur l'émission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Button to view all schedule grid */}
      <div className="shows-see-all-container">
        <Link to="/emissions" className="shows-see-all-btn">
          <span>Voir toute la grille des programmes</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}
