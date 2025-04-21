import { useState, useRef, useEffect } from 'react'

const AudioPlayer = ({ audioFile }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)
  
  useEffect(() => {
    // Reset player state when audio file changes
    setIsPlaying(false)
    setCurrentTime(0)
    
    // Set audio source
    if (audioRef.current) {
      audioRef.current.src = audioFile
      audioRef.current.volume = volume
    }
  }, [audioFile])
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }
  
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration)
  }
  
  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }
  
  const handleProgressChange = (e) => {
    const newTime = e.target.value
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
  }
  
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value
    setVolume(newVolume)
    audioRef.current.volume = newVolume
  }
  
  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00'
    
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  if (!audioFile) {
    return (
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No audio file selected</p>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      <audio 
        ref={audioRef}
        src={audioFile}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center justify-center mb-4">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full focus:outline-none"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="flex items-center mb-2">
        <span className="text-sm w-12">{formatTime(currentTime)}</span>
        <input
          ref={progressBarRef}
          type="range"
          className="w-full mx-2 accent-blue-500"
          min="0"
          max={duration || 0}
          step="0.01"
          value={currentTime}
          onChange={handleProgressChange}
        />
        <span className="text-sm w-12">{formatTime(duration)}</span>
      </div>
      
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <input
          type="range"
          className="w-24 mx-2 accent-blue-500"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  )
}

export default AudioPlayer
