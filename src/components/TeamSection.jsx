import React, { useEffect, useRef } from 'react'
import { Mic, Radio, User, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAnimators } from '../hooks/useAnimators'
import './TeamSection.css'

export default function TeamSection() {
  const sectionRef = useRef(null)
  const navigate = useNavigate()
  const { animators, loading } = useAnimators()

  // Limiter à 4 animateurs pour la page d'accueil
  const displayedAnimators = animators.slice(0, 4)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.reveal')
      elements.forEach(el => observer.observe(el))
      
      return () => {
        elements.forEach(el => observer.unobserve(el))
      }
    }
  }, [displayedAnimators]) // Re-run when data loads

  return (
    <section className="team-section" id="animateurs" ref={sectionRef}>
      <div className="team__ambient-bg"></div>
      
      <div className="team__container container">
        
        <div className="team__header reveal">
          <div className="team__badge">
            <Mic size={14} className="text-gold" />
            <span>Nos Voix</span>
          </div>
          <h2 className="team__title">
            Rencontrez nos <span className="text-gradient">Animateurs</span>
          </h2>
          <p className="team__desc">
            Des voix passionnées et inspirantes qui vous accompagnent chaque jour 
            sur Radio Vie Nouvelle, pour vous informer, vous divertir et nourrir votre foi.
          </p>
        </div>

        {loading ? (
          <div className="team__loading reveal">
            <div className="admin-spinner"></div>
            <p>Chargement de l'équipe...</p>
          </div>
        ) : (
          <div className="team__avatar-grid">
            {displayedAnimators.map((anim, index) => (
              <div 
                key={anim.id} 
                className="team__avatar-card reveal" 
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="team__avatar-wrapper">
                  <div className="team__avatar-ring"></div>
                  <div className="team__avatar-img-container">
                    {anim.img_url ? (
                      <img src={anim.img_url} alt={anim.name} className="team__avatar-img" />
                    ) : (
                      <div className="team__avatar-placeholder">
                        <User size={40} className="text-tertiary" />
                      </div>
                    )}
                  </div>
                  <div className="team__avatar-overlay">
                    <button className="team__avatar-btn" aria-label={`Écouter ${anim.name}`}>
                      <Radio size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="team__avatar-info">
                  <h3 className="team__name">{anim.name}</h3>
                  <p className="team__role">{anim.role}</p>
                  {anim.show && <div className="team__show-badge">{anim.show}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && animators.length > 4 && (
          <div className="team__actions reveal" style={{ transitionDelay: '400ms', textAlign: 'center', marginTop: '3rem' }}>
            <button 
              className="btn-submit" 
              style={{ display: 'inline-flex', width: 'auto', padding: '12px 32px' }}
              onClick={() => navigate('/animateurs')}
            >
              Voir toute l'équipe
              <ArrowRight size={18} />
            </button>
          </div>
        )}
        
      </div>
    </section>
  )
}
