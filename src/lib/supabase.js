import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yattjawfgnaroxifmmhp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhdHRqYXdmZ25hcm94aWZtbWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzExMzQsImV4cCI6MjA5OTAwNzEzNH0.lvB7JN1nIiBDd4oTVNJL_bq1DkpMI0XtclL9ZF8GIRs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Get the public URL for an image stored in program-images bucket
 */
export function getImageUrl(path) {
  if (!path) return null
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('program-images').getPublicUrl(path)
  return data?.publicUrl || null
}

/**
 * Upload an image to the program-images bucket
 * @param {File} file - The file to upload
 * @param {string} fileName - The name to give the file in storage
 * @returns {Promise<{path: string, url: string} | null>}
 */
export async function uploadProgramImage(file, fileName) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${fileName}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('program-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const url = getImageUrl(data.path)
  return { path: data.path, url }
}

/**
 * Delete an image from the program-images bucket
 */
export async function deleteProgramImage(path) {
  if (!path) return
  const { error } = await supabase.storage
    .from('program-images')
    .remove([path])
  if (error) {
    console.error('Error deleting image:', error)
  }
}
