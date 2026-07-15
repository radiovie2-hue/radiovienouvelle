import React, { useState } from 'react'
import { Radio, Music, Calendar, Mail, Facebook, Twitter, Instagram, Youtube, Phone, MapPin } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <footer className="footer">
      <div className="footer__glow-1"></div>
      <div className="footer__glow-2"></div>

      <div className="footer__container container">
        <div className="footer__grid">
          {/* Brand info */}
          <div className="footer__col footer__col--brand">
            <div className="footer__logo-area">
              <div className="footer__logo-icon">
                <Radio className="h-6 w-6 text-dark" />
              </div>
              <div>
                <h3 className="footer__title">Radio Vie Nouvelle</h3>
                <p className="footer__subtitle">FM 107.8 — La Fréquence de Vie</p>
              </div>
            </div>
            <p className="footer__description">
              Élevez votre esprit et nourrissez votre foi. Des émissions inspirantes, de la louange, et des enseignements bibliques 24/7 pour toute la famille.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-btn" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="footer__social-btn" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="footer__social-btn" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="footer__social-btn" aria-label="Youtube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">
              <Music size={16} className="text-gold" /> Liens Utiles
            </h4>
            <ul className="footer__links">
              <li><a href="#">Accueil</a></li>
              <li><a href="#shows-grid">Émissions</a></li>
              <li><a href="#">Podcasts</a></li>
              <li><a href="#">À Propos</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          {/* Schedule / Hours */}
          <div className="footer__col">
            <h4 className="footer__heading">
              <Calendar size={16} className="text-gold" /> Grille Populaire
            </h4>
            <ul className="footer__schedule">
              <li>
                <span className="footer__time">06:00 - 09:00</span>
                <span className="footer__show">Réveil Matinal</span>
              </li>
              <li>
                <span className="footer__time">12:00 - 14:00</span>
                <span className="footer__show">Parole et Vie</span>
              </li>
              <li>
                <span className="footer__time">15:00 - 17:00</span>
                <span className="footer__show">Famille & Société</span>
              </li>
              <li>
                <span className="footer__time">21:00 - 23:00</span>
                <span className="footer__show">Douce Présence</span>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="footer__col">
            <h4 className="footer__heading">
              <Mail size={16} className="text-gold" /> Newsletter
            </h4>
            <p className="footer__newsletter-text">
              Abonnez-vous pour recevoir les grilles de programmes et les événements spéciaux.
            </p>
            <form onSubmit={handleSubscribe} className="footer__form">
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="footer__input"
                disabled={status === 'submitting' || status === 'success'}
              />
              <button
                type="submit"
                className="footer__submit-btn"
                disabled={status === 'submitting' || status === 'success'}
              >
                {status === 'submitting' ? '...' : 'S\'abonner'}
              </button>
            </form>
            {status === 'success' && (
              <div className="footer__status success">Abonnement réussi ! Merci.</div>
            )}

            <div className="footer__contact-info">
              <p><Phone size={14} /> +237 6xx xx xx xx</p>
              <p><MapPin size={14} /> Yaoundé, Cameroun</p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Radio Vie Nouvelle. Tous droits réservés.</p>
          <div className="footer__bottom-links">
            <a href="#">Politique de Confidentialité</a>
            <a href="#">Mentions Légales</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
