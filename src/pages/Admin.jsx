import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { usePrograms, useProgramsAdmin, useCategories } from '../hooks/usePrograms'
import ProgramForm from '../components/admin/ProgramForm'
import ProgramTable from '../components/admin/ProgramTable'
import CommentsAdmin from '../components/admin/CommentsAdmin'
import AnimatorsAdmin from '../components/admin/AnimatorsAdmin'
import { Lock, LogOut, Radio, Plus, LayoutGrid, List, MessageSquare, Mic } from 'lucide-react'
import './Admin.css'

const ADMIN_PASSWORD = 'radiovie2026'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [selectedDay, setSelectedDay] = useState('Tous')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [activeTab, setActiveTab] = useState('programmes') // 'programmes', 'commentaires', 'animateurs'

  const DAYS = ['Tous', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  
  const { programs, loading, refetch } = usePrograms({
    day: selectedDay === 'Tous' ? null : selectedDay,
    includeInactive: true,
  })
  const { createProgram, updateProgram, deleteProgram, saving } = useProgramsAdmin()
  const { categories } = useCategories()

  // Check for saved session
  useEffect(() => {
    const saved = sessionStorage.getItem('rvn_admin_auth')
    if (saved === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('rvn_admin_auth', 'true')
      setPasswordError('')
    } else {
      setPasswordError('Mot de passe incorrect')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('rvn_admin_auth')
  }

  const handleSaveProgram = async (programData) => {
    let result
    if (editingProgram) {
      result = await updateProgram(editingProgram.id, programData)
    } else {
      result = await createProgram(programData)
    }

    if (!result.error) {
      setShowForm(false)
      setEditingProgram(null)
      refetch()
    }
    return result
  }

  const handleEditProgram = (program) => {
    setEditingProgram(program)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProgram = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      const result = await deleteProgram(id)
      if (!result.error) {
        refetch()
      }
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProgram(null)
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <Radio size={32} />
            </div>
            <h1>Administration</h1>
            <p>Radio Vie Nouvelle</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="admin-password">
                <Lock size={16} />
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe admin"
                autoFocus
              />
              {passwordError && <span className="admin-form-error">{passwordError}</span>}
            </div>
            <button type="submit" className="admin-login-btn">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header__left">
          <div className="admin-header__logo">
            <Radio size={24} />
          </div>
          <div>
            <h1 className="admin-header__title">Panneau d'administration</h1>
            <p className="admin-header__subtitle">Radio Vie Nouvelle</p>
          </div>
        </div>
        <div className="admin-header__right">
          <a href="/" className="admin-btn admin-btn--outline">
            Voir le site
          </a>
          <button onClick={handleLogout} className="admin-btn admin-btn--ghost">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className="admin-tabs-container">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'programmes' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('programmes')}
          >
            <Radio size={18} />
            Programmes
          </button>
          <button 
            className={`admin-tab ${activeTab === 'animateurs' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('animateurs')}
          >
            <Mic size={18} />
            Animateurs
          </button>
          <button 
            className={`admin-tab ${activeTab === 'commentaires' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('commentaires')}
          >
            <MessageSquare size={18} />
            Commentaires
          </button>
        </div>
      </div>

      <main className="admin-main">
        {activeTab === 'programmes' && (
          <>
            {/* Top action bar */}
            <div className="admin-actions">
              <div className="admin-actions__left">
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={() => { setEditingProgram(null); setShowForm(true) }}
                >
                  <Plus size={18} />
                  Nouveau Programme
                </button>
              </div>
              <div className="admin-actions__right">
                <div className="admin-view-toggle">
                  <button
                    className={`admin-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                    aria-label="Vue tableau"
                  >
                    <List size={18} />
                  </button>
                  <button
                    className={`admin-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Vue grille"
                  >
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Day filter */}
            <div className="admin-day-filter">
              {DAYS.map(day => (
                <button
                  key={day}
                  className={`admin-day-btn ${selectedDay === day ? 'admin-day-btn--active' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Form (shown when adding/editing) */}
            {showForm && (
              <div className="admin-form-section">
                <ProgramForm
                  program={editingProgram}
                  categories={categories}
                  onSave={handleSaveProgram}
                  onCancel={handleCancelForm}
                  saving={saving}
                />
              </div>
            )}

            {/* Programs Table/Grid */}
            <ProgramTable
              programs={programs}
              loading={loading}
              viewMode={viewMode}
              onEdit={handleEditProgram}
              onDelete={handleDeleteProgram}
            />
          </>
        )}

        {activeTab === 'animateurs' && <AnimatorsAdmin />}
        {activeTab === 'commentaires' && <CommentsAdmin />}
      </main>
    </div>
  )
}
