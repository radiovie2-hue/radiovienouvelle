import React, { useEffect } from 'react'
import { User, Radio } from 'lucide-react'
import { useAnimators } from '../hooks/useAnimators'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PlayerBar from '../components/PlayerBar'

export default function AnimatorsPage() {
  const { animators, loading } = useAnimators()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar />
      
      <main style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: 'var(--bg-background)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Nos <span className="text-gradient">Animateurs</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Découvrez l'équipe complète des voix qui animent Radio Vie Nouvelle et qui vous accompagnent au quotidien.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="admin-spinner"></div>
            </div>
          ) : (
            <div className="team__avatar-grid" style={{ paddingBottom: '4rem' }}>
              {animators.map((anim, index) => (
                <div key={anim.id} className="team__avatar-card" style={{ animationDelay: `${index * 50}ms` }}>
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
              
              {animators.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
                  Aucun animateur n'a été ajouté pour le moment.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <PlayerBar />
    </>
  )
}
