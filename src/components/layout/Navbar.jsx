import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isPlaying } = usePlayer()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/emissions', label: 'Émissions' },
    { to: '/podcasts', label: 'Podcasts' },
    { to: '/actualites', label: 'Actualités' },
    { to: '/a-propos', label: 'À Propos' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
          <img src={`${import.meta.env.BASE_URL}logo/vrai.png`} alt="Radio Vie Nouvelle" className="navbar__logo" />
          <div className="navbar__brand-text">
            <span className="navbar__name">Radio Vie Nouvelle</span>
            <span className="navbar__freq">FM 107.8</span>
          </div>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <button className="btn-glow navbar__cta" onClick={() => setMobileOpen(false)}>
            {isPlaying ? (
              <>
                <span className="live-dot"></span>
                En Direct
              </>
            ) : (
              'Écouter'
            )}
          </button>
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && <div className="navbar__backdrop" onClick={() => setMobileOpen(false)} />}
    </nav>
  )
}
