import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const AudioUpload = ({ setResult, setAudioFile, setIsLoading, setError }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file (WAV or MP3)')
      return
    }
    
    // Create object URL for audio preview
    const audioUrl = URL.createObjectURL(file)
    setAudioFile(audioUrl)
    
    // Reset states
    setResult(null)
    setError(null)
    setIsLoading(true)
    
    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Upload file to server
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Set result
      setResult(response.data)
    } catch (error) {
      console.error('Error uploading file:', error)
      setError(error.response?.data?.error || 'Error uploading file')
    } finally {
      setIsLoading(false)
    }
  }, [setResult, setAudioFile, setIsLoading, setError])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/wav': ['.wav'],
      'audio/mpeg': ['.mp3']
    },
    maxFiles: 1
  })
  
  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <svg 
          className="w-12 h-12 mb-4 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        
        {isDragActive ? (
          <p className="text-lg">Drop the audio file here...</p>
        ) : (
          <>
            <p className="text-lg mb-2">Drag & drop an audio file here, or click to select</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported formats: WAV, MP3
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default AudioUpload
