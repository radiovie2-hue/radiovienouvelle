import React, { useRef, useState, useEffect } from 'react'
import { usePrograms } from '../hooks/usePrograms'
import { DAYS } from '../data/shows'
import { ChevronLeft, ChevronRight, Clock, User, Radio, Sparkles, ImageIcon, Info } from 'lucide-react'
import './DailyProgramsCarousel.css'

export default function DailyProgramsCarousel() {
  const trackRef = useRef(null)
  const [currentDayName, setCurrentDayName] = useState('')

  useEffect(() => {
    const date = new Date()
    const jsDay = date.getDay()
    const mappedIndex = jsDay === 0 ? 6 : jsDay - 1
    const dayName = DAYS[mappedIndex]
    setCurrentDayName(dayName)
  }, [])

  const { programs: todayShows, loading } = usePrograms({ day: currentDayName })

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = 340
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Auto-scroll every 10 seconds
  useEffect(() => {
    if (!todayShows.length || loading) return

    const interval = setInterval(() => {
      if (trackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current
        const scrollAmount = 340
        
        // If we are at the end, scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          trackRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          })
        } else {
          trackRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          })
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [todayShows, loading])

  return (
    <section className="programs-carousel-section">
      <div className="container">
        <div className="carousel-header reveal visible">
          <div className="carousel-title-wrapper">
            <h2 className="carousel-title">
              Programmes du <span className="text-gradient">{currentDayName}</span>
            </h2>
            <p className="carousel-subtitle">Ne manquez pas vos émissions favorites d'aujourd'hui</p>
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => scroll('left')} aria-label="Précédent">
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-btn" onClick={() => scroll('right')} aria-label="Suivant">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="carousel-container reveal visible reveal-delay-1">
          <div className="carousel-track" ref={trackRef}>
            {loading ? (
              // Skeleton loading cards
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="program-card program-card--skeleton">
                  <div className="program-card__image-skeleton" />
                  <div className="program-card__text-skeleton" />
                  <div className="program-card__text-skeleton program-card__text-skeleton--short" />
                </div>
              ))
            ) : todayShows.length > 0 ? (
              todayShows.map((show) => (
                <div key={show.id} className="program-card group">
                  {/* Program Image Background */}
                  <div className="program-card__bg-wrapper">
                    {show.image ? (
                      <img
                        src={show.image}
                        alt={show.name}
                        className="program-card__bg-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="program-card__bg-placeholder">
                        <ImageIcon size={48} />
                        <span>{show.category}</span>
                      </div>
                    )}
                    <div className="program-card__gradient-overlay"></div>
                  </div>

                  <div className="program-card__content-wrapper">
                    <div className="program-card__top">
                      <span className={`category-tag category-tag--${show.category.toLowerCase()}`}>
                        {show.category}
                      </span>
                    </div>

                    <div className="program-card__bottom">
                      <h3 className="program-card__title">{show.name}</h3>

                      <div className="program-card__meta">
                        <div className="program-card__meta-item">
                          <Clock size={14} className="text-gold" />
                          <span>{show.time}</span>
                        </div>
                        <div className="program-card__meta-item">
                          <User size={14} className="text-gold" />
                          <span><strong>{show.host}</strong></span>
                        </div>
                      </div>

                      <div className="program-card__hover-content">
                        <p className="program-card__desc">{show.description}</p>

                        <button className="program-card__action">
                          <Info size={16} />
                          En savoir plus sur l'émission
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="program-card" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Radio size={48} className="text-gold" style={{ marginBottom: 16 }} />
                <h3 className="program-card__title">Programme en attente</h3>
                <p className="program-card__desc">Aucune émission n'est programmée pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
