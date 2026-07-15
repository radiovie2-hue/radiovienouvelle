import React from 'react'
import { getImageUrl } from '../../lib/supabase'
import { Edit, Trash2, Clock, User, Calendar, ImageIcon } from 'lucide-react'
import './ProgramTable.css'

export default function ProgramTable({ programs, loading, viewMode, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="program-table-loading">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="program-table-skeleton" />
        ))}
      </div>
    )
  }

  if (programs.length === 0) {
    return (
      <div className="program-table-empty">
        <ImageIcon size={48} />
        <h3>Aucun programme trouvé</h3>
        <p>Aucun programme ne correspond aux filtres sélectionnés.</p>
      </div>
    )
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="program-grid-view">
        {programs.map(program => (
          <div key={program.id} className="program-grid-card">
            <div className="program-grid-card__image">
              {program.image ? (
                <img src={program.image} alt={program.name} />
              ) : (
                <div className="program-grid-card__placeholder">
                  <ImageIcon size={24} />
                </div>
              )}
              {!program.is_active && (
                <span className="program-grid-card__inactive-badge">Inactif</span>
              )}
            </div>
            <div className="program-grid-card__body">
              <div className="program-grid-card__category">
                <span className={`ptag ptag--${program.category.toLowerCase()}`}>
                  {program.category}
                </span>
              </div>
              <h3 className="program-grid-card__title">{program.name}</h3>
              <div className="program-grid-card__meta">
                <span><Clock size={13} /> {program.time}</span>
                <span><User size={13} /> {program.host}</span>
              </div>
              <div className="program-grid-card__days">
                {program.days.map(day => (
                  <span key={day} className="program-grid-card__day">{day.slice(0, 3)}</span>
                ))}
              </div>
              <div className="program-grid-card__actions">
                <button
                  className="admin-btn admin-btn--outline admin-btn--sm"
                  onClick={() => onEdit(program)}
                >
                  <Edit size={14} /> Modifier
                </button>
                <button
                  className="admin-btn admin-btn--danger admin-btn--sm"
                  onClick={() => onDelete(program.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Table view (default)
  return (
    <div className="program-table-wrapper">
      <table className="program-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Programme</th>
            <th>Animateur</th>
            <th>Horaire</th>
            <th>Catégorie</th>
            <th>Jours</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map(program => (
            <tr key={program.id} className={!program.is_active ? 'row--inactive' : ''}>
              <td>
                <div className="program-table__thumb">
                  {program.image ? (
                    <img src={program.image} alt={program.name} />
                  ) : (
                    <div className="program-table__thumb-placeholder">
                      <ImageIcon size={16} />
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="program-table__name">{program.name}</div>
                <div className="program-table__desc">{program.description?.slice(0, 60)}...</div>
              </td>
              <td>{program.host}</td>
              <td>
                <span className="program-table__time">{program.time}</span>
              </td>
              <td>
                <span className={`ptag ptag--${program.category.toLowerCase()}`}>
                  {program.category}
                </span>
              </td>
              <td>
                <div className="program-table__days">
                  {program.days.map(day => (
                    <span key={day} className="program-table__day">{day.slice(0, 3)}</span>
                  ))}
                </div>
              </td>
              <td>
                <span className={`program-table__status ${program.is_active ? 'program-table__status--active' : 'program-table__status--inactive'}`}>
                  {program.is_active ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>
                <div className="program-table__actions">
                  <button
                    className="program-table__action-btn program-table__action-btn--edit"
                    onClick={() => onEdit(program)}
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="program-table__action-btn program-table__action-btn--delete"
                    onClick={() => onDelete(program.id)}
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
  )
}
