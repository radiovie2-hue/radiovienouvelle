import { useState, useEffect } from 'react'
import { supabase, getImageUrl } from '../lib/supabase'

/**
 * Hook to fetch podcasts from Supabase
 * @param {Object} options
 * @param {number} options.limit - Number of podcasts to fetch (default: null, fetch all)
 * @returns {{ podcasts: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function usePodcasts({ limit = null } = {}) {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPodcasts = async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('podcasts')
        .select('*')
        .order('date', { ascending: false }) // Sort by date descending (newest first)

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Process image URLs
      const processedData = data.map(podcast => ({
        ...podcast,
        coverImage: podcast.cover_image ? getImageUrl(podcast.cover_image) : null,
      }))

      setPodcasts(processedData)
    } catch (err) {
      console.error('Error fetching podcasts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPodcasts()

    // Subscribe to realtime changes on the podcasts table
    const subscription = supabase
      .channel('podcasts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'podcasts' }, () => {
        fetchPodcasts() // Refetch when data changes
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, []) // Empty dependency array means it runs on mount

  return { podcasts, loading, error, refetch: fetchPodcasts }
}
