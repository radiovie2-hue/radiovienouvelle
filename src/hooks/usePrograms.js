import { useState, useEffect } from 'react'
import { supabase, getImageUrl } from '../lib/supabase'
import { SHOWS, DAYS } from '../data/shows'

/**
 * Hook to fetch programs from Supabase with fallback to local data
 * @param {Object} options
 * @param {string} options.day - Filter by day name (e.g. 'Lundi')
 * @param {string} options.category - Filter by category
 * @param {boolean} options.includeInactive - Include inactive programs (for admin)
 * @returns {{ programs: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function usePrograms({ day = null, category = null, includeInactive = false } = {}) {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPrograms = async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('programs')
        .select('*')
        .order('time_start', { ascending: true })

      if (!includeInactive) {
        query = query.eq('is_active', true)
      }

      if (day) {
        query = query.contains('days', [day])
      }

      if (category && category !== 'Tous') {
        query = query.eq('category', category)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Transform data to match the component expected format
      const transformedData = data.map(program => ({
        ...program,
        time: `${program.time_start.slice(0, 5)} - ${program.time_end.slice(0, 5)}`,
        image: getImageUrl(program.image_url),
      }))

      setPrograms(transformedData)
    } catch (err) {
      console.error('Error fetching programs from Supabase, using fallback:', err)
      setError(err.message)

      // Fallback to local data
      let fallbackData = [...SHOWS]
      if (day) {
        fallbackData = fallbackData.filter(show => show.days.includes(day))
      }
      if (category && category !== 'Tous') {
        fallbackData = fallbackData.filter(show => show.category === category)
      }
      fallbackData.sort((a, b) => a.time.localeCompare(b.time))
      setPrograms(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [day, category, includeInactive])

  return { programs, loading, error, refetch: fetchPrograms }
}

/**
 * Hook to manage programs (CRUD operations) - for admin
 */
export function useProgramsAdmin() {
  const [saving, setSaving] = useState(false)

  const createProgram = async (programData) => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('programs')
        .insert([{
          name: programData.name,
          host: programData.host,
          time_start: programData.time_start,
          time_end: programData.time_end,
          description: programData.description,
          category: programData.category,
          image_url: programData.image_url || null,
          days: programData.days,
          is_active: programData.is_active !== undefined ? programData.is_active : true,
        }])
        .select()

      if (error) throw error
      return { data: data[0], error: null }
    } catch (err) {
      console.error('Error creating program:', err)
      return { data: null, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  const updateProgram = async (id, programData) => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('programs')
        .update({
          name: programData.name,
          host: programData.host,
          time_start: programData.time_start,
          time_end: programData.time_end,
          description: programData.description,
          category: programData.category,
          image_url: programData.image_url,
          days: programData.days,
          is_active: programData.is_active,
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return { data: data[0], error: null }
    } catch (err) {
      console.error('Error updating program:', err)
      return { data: null, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  const deleteProgram = async (id) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      console.error('Error deleting program:', err)
      return { error: err.message }
    } finally {
      setSaving(false)
    }
  }

  return { createProgram, updateProgram, deleteProgram, saving }
}

/**
 * Hook to get categories from Supabase
 */
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
        // Fallback
        setCategories([
          { name: 'Spirituel', color: '#A78BFA' },
          { name: 'Information', color: '#60A5FA' },
          { name: 'Musique', color: '#F472B6' },
          { name: 'Jeunesse', color: '#34D399' },
          { name: 'Société', color: '#FB923C' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading }
}
