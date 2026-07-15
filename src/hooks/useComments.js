import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook to manage comments (fetch approved and submit new)
 */
export function useComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const fetchComments = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch only approved comments
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false }) // Newest first

      if (fetchError) throw fetchError

      setComments(data)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitComment = async (authorName, content) => {
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError(null)

    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([
          { 
            author_name: authorName, 
            content: content,
            is_approved: false // Default to unapproved for moderation
          }
        ])

      if (insertError) throw insertError

      setSubmitSuccess(true)
    } catch (err) {
      console.error('Error submitting comment:', err)
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchComments()

    // Realtime updates for when an admin approves a comment
    const subscription = supabase
      .channel('comments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        fetchComments()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return { 
    comments, 
    loading, 
    error, 
    refetch: fetchComments,
    submitComment,
    isSubmitting,
    submitSuccess,
    submitError,
    setSubmitSuccess
  }
}

/**
 * Hook to manage comments from the Admin side
 */
export function useCommentsAdmin() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAllComments = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setComments(data)
    } catch (err) {
      console.error('Error fetching all comments:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: !currentStatus })
        .eq('id', id)
      
      if (error) throw error
      fetchAllComments()
      return { error: null }
    } catch (err) {
      console.error('Error updating comment:', err)
      return { error: err }
    }
  }

  const deleteComment = async (id) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchAllComments()
      return { error: null }
    } catch (err) {
      console.error('Error deleting comment:', err)
      return { error: err }
    }
  }

  return {
    comments,
    loading,
    error,
    fetchAllComments,
    toggleApproval,
    deleteComment
  }
}
