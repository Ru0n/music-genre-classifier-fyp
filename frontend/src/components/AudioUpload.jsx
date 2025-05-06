import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import Button from './ui/Button'

const AudioUpload = ({ setResult, setAudioFile, setIsLoading, setError }) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileDetails, setFileDetails] = useState(null)
  const [dragCount, setDragCount] = useState(0)

  // Reset progress when component unmounts
  useEffect(() => {
    return () => {
      setUploadProgress(0)
      setFileDetails(null)
    }
  }, [])

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]

    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file (WAV or MP3)')
      return
    }

    // Set file details for preview
    setFileDetails({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
      type: file.type
    })

    // Create object URL for audio preview
    const audioUrl = URL.createObjectURL(file)
    setAudioFile(audioUrl)

    // Reset states
    setResult(null)
    setError(null)
    setIsLoading(true)
    setUploadProgress(0)

    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Upload file to server with progress tracking
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(percentCompleted)
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

  // Handle drag events to provide better visual feedback
  const onDragEnter = () => setDragCount(prev => prev + 1)
  const onDragLeave = () => setDragCount(prev => prev - 1)

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: {
      'audio/wav': ['.wav'],
      'audio/mpeg': ['.mp3']
    },
    maxFiles: 1,
    noClick: fileDetails !== null // Disable click when file is selected
  })

  return (
    <div className="animate-fade-in">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragActive
            ? 'border-primary-500 bg-gradient-to-br from-primary-50/80 to-secondary-50/80 dark:from-primary-900/20 dark:to-secondary-900/20 scale-103 shadow-lg'
            : fileDetails
              ? 'border-green-500 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/10 dark:to-emerald-900/10 shadow-soft'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-soft cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
        }`}
        aria-label="Upload area for audio files"
      >
        <input {...getInputProps()} />

        {fileDetails ? (
          // File selected state
          <div className="flex flex-col items-center justify-center animate-scale-in">
            <div className="w-20 h-20 mb-5 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center shadow-inner-soft">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-xl font-medium mb-1 font-display">{fileDetails.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              {fileDetails.size} MB • {fileDetails.type.split('/')[1].toUpperCase()}
            </p>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full max-w-xs mb-5">
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner-soft">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFileDetails(null)
                  setAudioFile(null)
                  setResult(null)
                }}
                aria-label="Remove selected file"
                withIcon
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </Button>

              <Button
                variant="gradient"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  open()
                }}
                aria-label="Select a different file"
                withIcon
                glow
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Select Different File
              </Button>
            </div>
          </div>
        ) : (
          // No file selected state
          <div className="flex flex-col items-center justify-center">
            <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center shadow-inner-soft ${
              isDragActive
                ? 'bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 animate-pulse-slow'
                : 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700'
            }`}>
              <svg
                className={`w-12 h-12 ${
                  isDragActive
                    ? 'text-primary-600 dark:text-primary-400 animate-bounce-slow'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
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
            </div>

            {isDragActive ? (
              <div className="animate-pulse-slow">
                <p className="text-xl font-medium text-primary-700 dark:text-primary-300 font-display">Drop the audio file here...</p>
                <p className="text-sm text-primary-600/70 dark:text-primary-400/70 mt-2">
                  Release to upload your audio file
                </p>
              </div>
            ) : (
              <>
                <p className="text-xl font-medium mb-2 font-display">Drag & drop an audio file here, or click to select</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-md">
                  Upload your audio file (WAV or MP3) to classify its genre using our machine learning model
                </p>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={(e) => { e.stopPropagation(); open(); }}
                  withIcon
                  glow
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Select Audio File
                </Button>
                <div className="mt-5 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    WAV
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    MP3
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Max 10MB
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioUpload
