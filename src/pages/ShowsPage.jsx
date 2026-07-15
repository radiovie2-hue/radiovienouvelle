import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Calendar, User, Info, Search, ArrowLeft, Heart, Music, Award, X, Radio } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PlayerBar from '../components/PlayerBar'
import { usePrograms } from '../hooks/usePrograms'
import { usePlayer } from '../context/PlayerContext'
import { DAYS } from '../data/shows'
import '../components/ShowsGrid.css'
import './ShowsPage.css'

export default function ShowsPage() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [activeDay, setActiveDay] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedShow, setSelectedShow] = useState(null)

  const { setCurrentShow, isPlaying, play } = usePlayer()
  const { programs, loading } = usePrograms({ category: activeCategory })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const categories = ['Tous', 'Spirituel', 'Information', 'Musique', 'Jeunesse', 'Société']
  const daysList = ['Tous', ...DAYS]

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

  // Filter programs based on day and search query
  const filteredPrograms = programs.filter(show => {
    const matchesDay = activeDay === 'Tous' || (show.days && show.days.includes(activeDay))
    const matchesSearch = show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          show.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          show.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDay && matchesSearch
  })

  return (
    <>
      <Navbar />

      <main className="shows-page">
        {/* Banner Hero */}
        <section className="shows-page__hero">
          <div className="container">
            <div className="shows-page__top-nav">
              <Link to="/" className="shows-page__back-link">
                <ArrowLeft size={18} /> Retour à l'accueil
              </Link>
            </div>
            <div className="shows-page__header-tag">
              <span className="section-subtitle">
                <Radio size={18} className="subtitle-icon" />
                Grille Antenne
              </span>
            </div>
            <h1 className="shows-page__title">Toutes nos Émissions</h1>
            <p className="shows-page__description">
              Retrouvez l'intégralité des programmes de Radio Vie Nouvelle classés par jour et par catégorie.
            </p>

            {/* Search Bar */}
            <div className="shows-page__search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher une émission, un animateur..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="shows-page__content section-padding">
          <div className="container">
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

            {/* Days Filter Tabs */}
            <div className="days-filter-bar">
              <span className="days-filter-label">Filtrer par jour :</span>
              <div className="days-filter-buttons">
                {daysList.map(day => (
                  <button
                    key={day}
                    className={`day-filter-btn ${activeDay === day ? 'day-filter-btn--active' : ''}`}
                    onClick={() => setActiveDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Shows Grid */}
            <div className="shows-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card show-card show-card--skeleton reveal visible">
                    <div className="show-card__image-skeleton" />
                    <div className="show-card__content-skeleton">
                      <div className="skeleton-line skeleton-line--short" />
                      <div className="skeleton-line" />
                      <div className="skeleton-line skeleton-line--medium" />
                    </div>
                  </div>
                ))
              ) : filteredPrograms.length > 0 ? (
                filteredPrograms.map(show => (
                  <div key={show.id} className="glass-card show-card reveal visible">
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
                          <Radio size={48} />
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
                            onClick={() => setSelectedShow(show)}
                          >
                            <Info size={16} />
                            En savoir plus sur l'émission
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="shows-empty-state text-center">
                  <Radio size={48} />
                  <h3>Aucune émission trouvée</h3>
                  <p>Aucun programme ne correspond aux filtres sélectionnés.</p>
                  <button
                    className="btn-glow"
                    onClick={() => { setActiveCategory('Tous'); setActiveDay('Tous'); setSearchQuery(''); }}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Show Detail Modal */}
      {selectedShow && (
        <div className="shows-modal-overlay" onClick={() => setSelectedShow(null)}>
          <div className="shows-modal" onClick={e => e.stopPropagation()}>
            <button className="shows-modal__close" onClick={() => setSelectedShow(null)}>
              <X size={24} />
            </button>
            <div className="shows-modal__hero">
              {selectedShow.image && (
                <img src={selectedShow.image} alt={selectedShow.name} className="shows-modal__image" />
              )}
              <div className="shows-modal__hero-overlay">
                <span className={`category-tag category-tag--${selectedShow.category.toLowerCase()}`}>
                  {selectedShow.category}
                </span>
                <h2>{selectedShow.name}</h2>
              </div>
            </div>
            <div className="shows-modal__body">
              <div className="shows-modal__meta">
                <span><Clock size={16} /> {selectedShow.time}</span>
                <span><User size={16} /> Présenté par {selectedShow.host}</span>
                <span><Calendar size={16} /> {selectedShow.days.join(', ')}</span>
              </div>
              <p className="shows-modal__description">{selectedShow.description}</p>
              <button
                className="btn-glow w-100"
                onClick={() => {
                  handleListenShow(selectedShow.name)
                  setSelectedShow(null)
                }}
              >
                Écouter la radio
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <PlayerBar />
    </>
  )
}
