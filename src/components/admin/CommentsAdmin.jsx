import React, { useEffect } from 'react'
import { useCommentsAdmin } from '../../hooks/useComments'
import { Check, X, Trash2, MessageSquare, AlertCircle } from 'lucide-react'
import './CommentsAdmin.css'

export default function CommentsAdmin() {
  const { 
    comments, 
    loading, 
    error, 
    fetchAllComments, 
    toggleApproval, 
    deleteComment 
  } = useCommentsAdmin()

  useEffect(() => {
    fetchAllComments()
  }, [])

  const handleToggle = async (id, currentStatus) => {
    await toggleApproval(id, currentStatus)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce commentaire ?")) {
      await deleteComment(id)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  if (loading && comments.length === 0) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Chargement des commentaires...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-error">
        <AlertCircle size={24} />
        <p>Erreur: {error}</p>
      </div>
    )
  }

  return (
    <div className="comments-admin">
      <div className="comments-admin__header">
        <h2>Modération des Commentaires</h2>
        <div className="comments-admin__stats">
          <div className="stat-badge">
            <span className="stat-value">{comments.length}</span> Total
          </div>
          <div className="stat-badge stat-badge--pending">
            <span className="stat-value">{comments.filter(c => !c.is_approved).length}</span> En attente
          </div>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="comments-admin__empty" style={{ padding: '4rem', textAlign: 'center', background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0' }}>
          <MessageSquare size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b' }}>Aucun commentaire pour le moment.</p>
        </div>
      ) : (
        <div className="program-table-wrapper">
          <table className="program-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Auteur</th>
                <th style={{ width: '40%' }}>Message</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id} style={!comment.is_approved ? { background: '#fffbeb' } : {}}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(comment.created_at)}</td>
                  <td style={{ fontWeight: 600 }}>{comment.author_name}</td>
                  <td style={{ fontSize: '0.9rem' }}>{comment.content}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: comment.is_approved ? '#dcfce7' : '#fef9c3',
                      color: comment.is_approved ? '#166534' : '#854d0e'
                    }}>
                      {comment.is_approved ? 'Approuvé' : 'En attente'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: comment.is_approved ? '#94a3b8' : '#16a34a',
                          padding: '4px'
                        }}
                        onClick={() => handleToggle(comment.id, comment.is_approved)}
                        title={comment.is_approved ? "Masquer" : "Approuver"}
                      >
                        {comment.is_approved ? <X size={16} /> : <Check size={16} />}
                      </button>
                      <button 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                        onClick={() => handleDelete(comment.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
