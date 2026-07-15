import React, { useState } from 'react'
import { MessageSquare, Send, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { useComments } from '../hooks/useComments'
import './CommentsSection.css'

export default function CommentsSection() {
  const {
    comments,
    loading,
    submitComment,
    isSubmitting,
    submitSuccess,
    submitError,
    setSubmitSuccess
  } = useComments()

  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim()) return

    await submitComment(authorName, content)

    // Clear form if successful
    if (!submitError) {
      setAuthorName('')
      setContent('')

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  return (
    <section className="comments-section" id="commentaires">
      <div className="container">

        <div className="comments__header reveal visible">
          <div className="comments__subtitle">
            <MessageSquare size={16} className="text-gold" />
            <span>La parole est à vous</span>
          </div>
          <h2 className="comments__title">Vos Témoignages</h2>
          <p className="comments__desc">
            Partagez vos impressions, vos encouragements ou ce que Radio Vie Nouvelle vous apporte au quotidien.
          </p>
        </div>

        <div className="comments__layout">

          {/* Form Column */}
          <div className="comments__form-container reveal visible reveal-delay-1">
            <h3 className="comments__form-title">Laissez un commentaire</h3>

            {submitSuccess ? (
              <div className="comments__feedback comments__feedback--success">
                <CheckCircle2 size={24} />
                <div>
                  <h4>Merci pour votre message !</h4>
                  <p>Il a bien été envoyé et est en attente de modération par notre équipe.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="comments__form">
                {submitError && (
                  <div className="comments__feedback comments__feedback--error">
                    <AlertCircle size={20} />
                    <p>{submitError}</p>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="comment-name">Votre nom</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      id="comment-name"
                      placeholder="Ex: Jean Dupont"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comment-content">Votre message</label>
                  <textarea
                    id="comment-content"
                    placeholder="Ce que vous souhaitez partager..."
                    rows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`btn-submit ${isSubmitting ? 'btn-submit--loading' : ''}`}
                  disabled={isSubmitting || !authorName.trim() || !content.trim()}
                >
                  {isSubmitting ? 'Envoi en cours...' : (
                    <>
                      Envoyer le message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Comments List Column */}
          <div className="comments__list-container reveal visible reveal-delay-2">
            <h3 className="comments__list-title">
              Derniers messages ({comments.length})
            </h3>

            <div className="comments__list">
              {loading ? (
                // Skeleton loading
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="comment-card comment-card--skeleton">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line skeleton-line--short"></div>
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line skeleton-line--medium"></div>
                    </div>
                  </div>
                ))
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-card__avatar">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-card__body">
                      <div className="comment-card__header">
                        <h4 className="comment-card__author">{comment.author_name}</h4>
                        <span className="comment-card__date">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="comment-card__content">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="comments__empty">
                  <MessageSquare size={32} className="text-tertiary" />
                  <p>Aucun témoignage pour le moment. Soyez le premier à en laisser un !</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
