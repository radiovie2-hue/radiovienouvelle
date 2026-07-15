import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAnimators() {
  const [animators, setAnimators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnimators = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('animators')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (fetchError) throw fetchError
      setAnimators(data)
    } catch (err) {
      console.error('Error fetching animators:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimators()
  }, [])

  return { animators, loading, error, refetch: fetchAnimators }
}

export function useAnimatorsAdmin() {
  const [saving, setSaving] = useState(false)

  const createAnimator = async (animatorData) => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('animators')
        .insert([animatorData])
        .select()
      
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      console.error('Error creating animator:', err)
      return { data: null, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  const updateAnimator = async (id, animatorData) => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('animators')
        .update(animatorData)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      console.error('Error updating animator:', err)
      return { data: null, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  const deleteAnimator = async (id) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('animators')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (err) {
      console.error('Error deleting animator:', err)
      return { error: err.message }
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (file) => {
    setSaving(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `animators/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('program-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('program-images')
        .getPublicUrl(filePath)

      return { publicUrl: data.publicUrl, error: null }
    } catch (err) {
      console.error('Error uploading image:', err)
      return { publicUrl: null, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  return { createAnimator, updateAnimator, deleteAnimator, uploadImage, saving }
}
