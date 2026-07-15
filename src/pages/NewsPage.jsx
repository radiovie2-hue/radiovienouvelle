import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, ArrowRight, X, Newspaper, Search, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PlayerBar from '../components/PlayerBar'
import { newsArticles } from '../data/newsData'
import '../components/NewsSection.css'
import './NewsPage.css'

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeArticle, setActiveArticle] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const categories = ['Tous', 'Événements', 'Programmes', 'Témoignages']

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Navbar />

      <main className="news-page">
        {/* Banner Header */}
        <section className="news-page__hero">
          <div className="container">
            <div className="news-page__top-nav">
              <Link to="/" className="news-page__back-link">
                <ArrowLeft size={18} /> Retour à l'accueil
              </Link>
            </div>
            <div className="news-page__header-tag">
              <span className="section-subtitle">
                <Newspaper size={18} className="subtitle-icon" />
                Journal & Médias
              </span>
            </div>
            <h1 className="news-page__title">Toutes nos Actualités</h1>
            <p className="news-page__description">
              Restez connectés à la vie de la station, découvrez nos dossiers spéciaux et l'agenda de nos événements.
            </p>

            {/* Search Bar */}
            <div className="news-page__search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un article ou un sujet..."
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
        <section className="news-page__content section-padding">
          <div className="container">
            {/* Category Filter Tabs */}
            <div className="news-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`news-tab ${selectedCategory === cat ? 'news-tab--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="news-grid">
                {filteredArticles.map(article => (
                  <article key={article.id} className="news-card">
                    <div className="news-card__image-wrapper">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="news-card__image"
                        loading="lazy"
                      />
                      <span className="news-card__category">{article.category}</span>
                    </div>

                    <div className="news-card__content">
                      <div className="news-card__meta">
                        <span className="meta-item">
                          <Calendar size={14} /> {article.date}
                        </span>
                        <span className="meta-item">
                          <Clock size={14} /> {article.readTime}
                        </span>
                      </div>

                      <h3 className="news-card__title">{article.title}</h3>
                      <p className="news-card__excerpt">{article.excerpt}</p>

                      <div className="news-card__footer">
                        <span className="news-card__author">
                          <User size={14} /> {article.author}
                        </span>
                        <button
                          className="news-card__btn"
                          onClick={() => setActiveArticle(article)}
                        >
                          Lire l'article
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="news-empty-state text-center">
                <Newspaper size={48} />
                <h3>Aucun article trouvé</h3>
                <p>Aucun résultat ne correspond à votre recherche "{searchQuery}".</p>
                <button className="btn-glow" onClick={() => { setSearchQuery(''); setSelectedCategory('Tous'); }}>
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="news-modal-overlay" onClick={() => setActiveArticle(null)}>
          <div className="news-modal" onClick={e => e.stopPropagation()}>
            <button
              className="news-modal__close"
              onClick={() => setActiveArticle(null)}
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            <div className="news-modal__hero">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="news-modal__image"
              />
              <div className="news-modal__hero-overlay">
                <span className="news-card__category">{activeArticle.category}</span>
                <h2 className="news-modal__title">{activeArticle.title}</h2>
              </div>
            </div>

            <div className="news-modal__body">
              <div className="news-modal__meta">
                <span><Calendar size={16} /> {activeArticle.date}</span>
                <span><User size={16} /> Par {activeArticle.author}</span>
                <span><Clock size={16} /> Lecture : {activeArticle.readTime}</span>
              </div>

              <div className="news-modal__text">
                {activeArticle.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <PlayerBar />
    </>
  )
}
