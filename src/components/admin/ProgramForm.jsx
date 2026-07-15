import React, { useState, useEffect, useRef } from 'react'
import { uploadProgramImage, getImageUrl } from '../../lib/supabase'
import { Save, X, Upload, ImageIcon, Trash2 } from 'lucide-react'
import './ProgramForm.css'

const ALL_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const DEFAULT_CATEGORIES = ['Spirituel', 'Information', 'Musique', 'Jeunesse', 'Société']

export default function ProgramForm({ program, categories = [], onSave, onCancel, saving }) {
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    time_start: '08:00',
    time_end: '09:00',
    description: '',
    category: 'Spirituel',
    days: [],
    is_active: true,
    image_url: null,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})

  const categoryNames = categories.length > 0
    ? categories.map(c => c.name)
    : DEFAULT_CATEGORIES

  // Populate form when editing
  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name || '',
        host: program.host || '',
        time_start: program.time_start?.slice(0, 5) || '08:00',
        time_end: program.time_end?.slice(0, 5) || '09:00',
        description: program.description || '',
        category: program.category || 'Spirituel',
        days: program.days || [],
        is_active: program.is_active !== undefined ? program.is_active : true,
        image_url: program.image_url || null,
      })
      if (program.image_url) {
        setImagePreview(getImageUrl(program.image_url))
      }
    }
  }, [program])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }))
    if (errors.days) {
      setErrors(prev => ({ ...prev, days: null }))
    }
  }

  const handleSelectAllDays = () => {
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    setFormData(prev => ({
      ...prev,
      days: prev.days.length === weekDays.length && weekDays.every(d => prev.days.includes(d))
        ? []
        : [...weekDays],
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Veuillez sélectionner une image valide' }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'L\'image ne doit pas dépasser 5 Mo' }))
      return
    }

    setImageFile(file)
    setErrors(prev => ({ ...prev, image: null }))

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image_url: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.host.trim()) newErrors.host = 'L\'animateur est requis'
    if (!formData.time_start) newErrors.time_start = 'L\'heure de début est requise'
    if (!formData.time_end) newErrors.time_end = 'L\'heure de fin est requise'
    if (formData.days.length === 0) newErrors.days = 'Sélectionnez au moins un jour'
    if (!formData.description.trim()) newErrors.description = 'La description est requise'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    let imageUrl = formData.image_url

    // Upload image if a new file was selected
    if (imageFile) {
      setUploading(true)
      const fileName = `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      const result = await uploadProgramImage(imageFile, fileName)
      setUploading(false)

      if (result) {
        imageUrl = result.path
      }
    }

    const result = await onSave({
      ...formData,
      image_url: imageUrl,
    })

    if (result?.error) {
      setErrors(prev => ({ ...prev, submit: result.error }))
    }
  }

  const isSubmitting = saving || uploading

  return (
    <div className="program-form-card">
      <div className="program-form-header">
        <h2>{program ? 'Modifier le programme' : 'Nouveau programme'}</h2>
        <button className="program-form-close" onClick={onCancel} aria-label="Fermer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="program-form">
        <div className="program-form__grid">
          {/* Left column */}
          <div className="program-form__col">
            {/* Name */}
            <div className="pf-group">
              <label htmlFor="pf-name">Nom de l'émission *</label>
              <input
                id="pf-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Réveil Spirituel"
                className={errors.name ? 'pf-input--error' : ''}
              />
              {errors.name && <span className="pf-error">{errors.name}</span>}
            </div>

            {/* Host */}
            <div className="pf-group">
              <label htmlFor="pf-host">Animateur *</label>
              <input
                id="pf-host"
                name="host"
                type="text"
                value={formData.host}
                onChange={handleChange}
                placeholder="Ex: Pasteur Jean"
                className={errors.host ? 'pf-input--error' : ''}
              />
              {errors.host && <span className="pf-error">{errors.host}</span>}
            </div>

            {/* Time */}
            <div className="pf-group pf-group--row">
              <div className="pf-group pf-group--half">
                <label htmlFor="pf-time-start">Début *</label>
                <input
                  id="pf-time-start"
                  name="time_start"
                  type="time"
                  value={formData.time_start}
                  onChange={handleChange}
                  className={errors.time_start ? 'pf-input--error' : ''}
                />
                {errors.time_start && <span className="pf-error">{errors.time_start}</span>}
              </div>
              <div className="pf-group pf-group--half">
                <label htmlFor="pf-time-end">Fin *</label>
                <input
                  id="pf-time-end"
                  name="time_end"
                  type="time"
                  value={formData.time_end}
                  onChange={handleChange}
                  className={errors.time_end ? 'pf-input--error' : ''}
                />
                {errors.time_end && <span className="pf-error">{errors.time_end}</span>}
              </div>
            </div>

            {/* Category */}
            <div className="pf-group">
              <label htmlFor="pf-category">Catégorie</label>
              <select
                id="pf-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categoryNames.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="pf-group">
              <label htmlFor="pf-description">Description *</label>
              <textarea
                id="pf-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez brièvement l'émission..."
                rows={3}
                className={errors.description ? 'pf-input--error' : ''}
              />
              {errors.description && <span className="pf-error">{errors.description}</span>}
            </div>
          </div>

          {/* Right column */}
          <div className="program-form__col">
            {/* Image Upload */}
            <div className="pf-group">
              <label>Image de l'émission</label>
              <div className="pf-image-upload">
                {imagePreview ? (
                  <div className="pf-image-preview">
                    <img src={imagePreview} alt="Prévisualisation" />
                    <button
                      type="button"
                      className="pf-image-remove"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="pf-image-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={32} />
                    <span>Cliquez pour ajouter une image</span>
                    <span className="pf-image-hint">JPG, PNG, WebP — Max 5 Mo</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                {errors.image && <span className="pf-error">{errors.image}</span>}
              </div>
            </div>

            {/* Days */}
            <div className="pf-group">
              <label>Jours de diffusion *</label>
              <div className="pf-days-header">
                <button
                  type="button"
                  className="pf-select-all-btn"
                  onClick={handleSelectAllDays}
                >
                  Lun — Ven
                </button>
              </div>
              <div className="pf-days-grid">
                {ALL_DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`pf-day-btn ${formData.days.includes(day) ? 'pf-day-btn--active' : ''}`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              {errors.days && <span className="pf-error">{errors.days}</span>}
            </div>

            {/* Active toggle */}
            <div className="pf-group">
              <label className="pf-toggle-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="pf-toggle-input"
                />
                <span className="pf-toggle-switch"></span>
                <span>Programme actif</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="pf-submit-error">{errors.submit}</div>
        )}

        {/* Actions */}
        <div className="program-form__actions">
          <button type="button" className="admin-btn admin-btn--outline" onClick={onCancel}>
            Annuler
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting
              ? (uploading ? 'Upload en cours...' : 'Enregistrement...')
              : (program ? 'Mettre à jour' : 'Créer le programme')
            }
          </button>
        </div>
      </form>
    </div>
  )
}
