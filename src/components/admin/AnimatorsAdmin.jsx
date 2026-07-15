import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react'
import { useAnimators, useAnimatorsAdmin } from '../../hooks/useAnimators'
import './AnimatorsAdmin.css'

export default function AnimatorsAdmin() {
  const { animators, loading: fetching, error: fetchError, refetch } = useAnimators()
  const { createAnimator, updateAnimator, deleteAnimator, uploadImage, saving } = useAnimatorsAdmin()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    show: '',
    img_url: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [formError, setFormError] = useState('')

  const handleOpenForm = (anim = null) => {
    if (anim) {
      setEditingId(anim.id)
      setFormData({
        name: anim.name || '',
        role: anim.role || '',
        show: anim.show || '',
        img_url: anim.img_url || ''
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', role: '', show: '', img_url: '' })
    }
    setSelectedFile(null)
    setFormError('')
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setSelectedFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      setFormError('Le nom est requis.')
      return
    }

    let finalImageUrl = formData.img_url

    if (selectedFile) {
      const { publicUrl, error: uploadError } = await uploadImage(selectedFile)
      if (uploadError) {
        setFormError("Erreur lors de l'upload: " + uploadError)
        return
      }
      finalImageUrl = publicUrl
    }

    const payload = { ...formData, img_url: finalImageUrl }

    let result
    if (editingId) {
      result = await updateAnimator(editingId, payload)
    } else {
      result = await createAnimator(payload)
    }

    if (result.error) {
      setFormError(result.error)
    } else {
      handleCloseForm()
      refetch()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet animateur ?')) {
      const result = await deleteAnimator(id)
      if (!result.error) {
        refetch()
      } else {
        alert("Erreur lors de la suppression: " + result.error)
      }
    }
  }

  return (
    <div className="animators-admin">
      <div className="animators-admin__header">
        <h2>Gestion des Animateurs</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Ajouter un animateur
        </button>
      </div>

      {fetchError && (
        <div className="admin-error">
          <AlertCircle size={20} />
          <p>{fetchError}</p>
        </div>
      )}

      {showForm && (
        <div className="program-form-card" style={{ marginBottom: '2rem' }}>
          <div className="program-form-header">
            <h2>{editingId ? "Modifier l'animateur" : "Nouvel animateur"}</h2>
            <button className="program-form-close" onClick={handleCloseForm}><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="program-form">
            {formError && <div className="admin-form-error" style={{ marginBottom: '1rem' }}>{formError}</div>}
            
            <div className="program-form__grid">
              <div className="program-form__col">
                <div className="pf-group">
                  <label>Nom de l'animateur *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="pf-group">
                  <label>Rôle (ex: Journaliste, Animation)</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
              </div>

              <div className="program-form__col">
                <div className="pf-group">
                  <label>Émission associée</label>
                  <input 
                    type="text" 
                    value={formData.show}
                    onChange={e => setFormData({...formData, show: e.target.value})}
                  />
                </div>

                <div className="pf-group">
                  <label>Photo de l'animateur (Optionnel)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0])
                      }
                    }}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '10px 14px', fontSize: '0.95rem' }}
                  />
                  {formData.img_url && !selectedFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#16a34a' }}>
                      Image actuelle enregistrée.
                    </div>
                  )}
                  {selectedFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#16a34a' }}>
                      Fichier sélectionné : {selectedFile.name}
                    </div>
                  )}
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Si vide, un avatar par défaut sera affiché.</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="admin-btn admin-btn--outline" onClick={handleCloseForm}>
                Annuler
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                <Save size={18} /> {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="program-table-wrapper">
          {fetching ? (
            <div className="program-table-loading" style={{ padding: '2rem' }}>
              <div className="program-table-skeleton"></div>
              <div className="program-table-skeleton"></div>
            </div>
          ) : (
            <table className="program-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Nom</th>
                  <th>Rôle</th>
                  <th>Émission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {animators.length === 0 ? (
                  <tr><td colSpan="5" className="text-center" style={{ padding: '2rem', color: '#94a3b8' }}>Aucun animateur trouvé.</td></tr>
                ) : (
                  animators.map(anim => (
                    <tr key={anim.id}>
                      <td>
                        <div className="program-table__thumb" style={{ borderRadius: '50%' }}>
                          {anim.img_url ? (
                            <img src={anim.img_url} alt={anim.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                          )}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{anim.name}</td>
                      <td>{anim.role}</td>
                      <td>{anim.show}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-icon text-gold" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => handleOpenForm(anim)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-icon" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDelete(anim.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
