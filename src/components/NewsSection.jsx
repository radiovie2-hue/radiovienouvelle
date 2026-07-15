import React, { useState } from 'react'
import { Calendar, Clock, User, ArrowRight, X, Newspaper } from 'lucide-react'
import { Link } from 'react-router-dom'
import { newsArticles } from '../data/newsData'
import './NewsSection.css'

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [activeArticle, setActiveArticle] = useState(null)

  const categories = ['Tous', 'Événements', 'Programmes', 'Témoignages']

  const filteredArticles = selectedCategory === 'Tous'
    ? newsArticles
    : newsArticles.filter(article => article.category === selectedCategory)

  // Strictly display 3 articles on the homepage
  const displayedArticles = filteredArticles.slice(0, 3)

  return (
    <section className="news-section section-padding" id="actualites">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-subtitle">
            <Newspaper size={18} className="subtitle-icon" />
            Restez informés
          </span>
          <h2 className="section-title">Actualités & Articles</h2>
          <p className="section-description">
            Suivez les dernières nouvelles de votre radio, les événements à venir et des éditos inspirants.
          </p>
        </div>

        {/* Category Tabs */}
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

        {/* Articles Grid (3 items max) */}
        <div className="news-grid">
          {displayedArticles.map(article => (
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

        {/* Button navigating to dedicated /actualites page */}
        <div className="news-see-all-container">
          <Link to="/actualites" className="news-see-all-btn">
            <span>Voir toutes les actualités</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

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
    </section>
  )
}
