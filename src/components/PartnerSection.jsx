import React, { useEffect, useRef } from 'react'
import { Heart, Mic, Sparkles } from 'lucide-react'
import './PartnerSection.css'

// GlowCard Component: Creates a card with a dynamic glowing border that follows the mouse
const GlowCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const syncPointer = (e) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', syncPointer);
      return () => card.removeEventListener('mousemove', syncPointer);
    }
  }, []);

  return (
    <div ref={cardRef} className={`glow-card ${className}`}>
      <div className="glow-card__inner">
        {children}
      </div>
    </div>
  );
};

export default function PartnerSection() {
  // Generate random particles for the background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${3 + Math.random() * 3}s`
  }));

  return (
    <section className="partner-section" id="participer">
      {/* Ambient Background */}
      <div className="partner__ambient-bg"></div>
      
      {/* Gold Glow Effects */}
      <div className="partner__glow-orb partner__glow-orb--1"></div>
      <div className="partner__glow-orb partner__glow-orb--2"></div>
      
      {/* Grid Pattern */}
      <div className="partner__grid-pattern"></div>

      {/* Floating Particles */}
      <div className="partner__particles">
        {particles.map(p => (
          <div 
            key={p.id} 
            className="partner__particle"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="container partner__container reveal visible">
        <GlowCard className="partner__card-wrapper">
          <div className="partner__content">
            
            {/* Badge */}
            <div className="partner__badge">
              <Sparkles size={14} className="text-gold" />
              <span>Partenariat Premium</span>
            </div>

            {/* Title */}
            <h2 className="partner__title">
              Rejoignez le <span className="text-gradient">Cercle de Vie</span>
            </h2>

            {/* Description */}
            <p className="partner__desc">
              Vivez une expérience radiophonique unique. Devenez partenaire de Radio Vie Nouvelle 
              pour soutenir notre mission spirituelle, ou intervenez en direct pour partager 
              vos requêtes et témoignages avec toute la communauté.
            </p>

            {/* Stats Row */}
            <div className="partner__stats">
              <div className="partner__stat-item">
                <div className="stat-value">500+</div>
                <div className="stat-label">Partenaires</div>
              </div>
              <div className="partner__stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Diffusion</div>
              </div>
              <div className="partner__stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">Engagement</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="partner__actions">
              <button className="partner__btn partner__btn--primary">
                <div className="btn-bg btn-bg--1"></div>
                <div className="btn-bg btn-bg--2"></div>
                <span className="btn-content">
                  <Heart size={20} />
                  Soutenir la Radio
                </span>
              </button>

              <button className="partner__btn partner__btn--secondary">
                <div className="btn-bg btn-bg--3"></div>
                <span className="btn-content">
                  <Mic size={20} />
                  Participer au Direct
                </span>
              </button>
            </div>

          </div>
        </GlowCard>
      </div>
    </section>
  )
}
