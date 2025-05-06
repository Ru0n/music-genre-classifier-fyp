import { useState, useRef, useEffect } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'

const AudioPlayer = ({ audioFile, genreColor = '#3b82f6' }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showVolumeControl, setShowVolumeControl] = useState(false)

  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  // Canvas ref for waveform visualization
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    // Reset player state when audio file changes
    setIsPlaying(false)
    setCurrentTime(0)

    // Set audio source
    if (audioRef.current) {
      audioRef.current.src = audioFile
      audioRef.current.volume = volume
      audioRef.current.playbackRate = playbackRate
    }

    return () => {
      // Clean up animation frame on unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [audioFile])

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when this component is in focus
      if (!audioRef.current || document.activeElement.tagName === 'INPUT') return

      switch (e.key) {
        case ' ': // Space bar
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          audioRef.current.currentTime += 5 // Skip forward 5 seconds
          break
        case 'ArrowLeft':
          audioRef.current.currentTime -= 5 // Skip backward 5 seconds
          break
        case 'm':
          toggleMute()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted
      audioRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  const handlePlaybackRateChange = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0)
    }
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

    // If changing volume from zero or to zero, update muted state
    if (newVolume === '0' && !isMuted) {
      setIsMuted(true)
      audioRef.current.muted = true
    } else if (newVolume !== '0' && isMuted) {
      setIsMuted(false)
      audioRef.current.muted = false
    }
  }

  // Draw waveform visualization
  const drawWaveform = () => {
    if (!audioRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audioRef.current)

    source.connect(analyser)
    analyser.connect(audioContext.destination)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame)

      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.fillStyle = 'rgba(0, 0, 0, 0)'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      const barWidth = (WIDTH / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * HEIGHT

        // Use genre color with varying opacity based on frequency
        const alpha = 0.5 + (dataArray[i] / 255) * 0.5
        ctx.fillStyle = genreColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba')

        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)
        x += barWidth + 1
      }
    }

    renderFrame()
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
      <Card className="text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">No audio file selected</p>
      </Card>
    )
  }

  return (
    <Card className="p-5 animate-fade-in">
      <audio
        ref={audioRef}
        src={audioFile}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => drawWaveform()}
      />

      {/* Waveform visualization */}
      <div className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-20">
        <canvas
          ref={canvasRef}
          width="1000"
          height="80"
          className="w-full h-full"
        ></canvas>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={skipBackward}
          className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-label="Skip backward 10 seconds"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
          </svg>
        </button>

        <button
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{ backgroundColor: genreColor }}
        >
          {isPlaying ? (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={skipForward}
          className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-label="Skip forward 10 seconds"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center mb-4">
        <span className="text-sm w-12 text-gray-600 dark:text-gray-400">{formatTime(currentTime)}</span>
        <div className="relative w-full mx-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-100"
            style={{
              width: `${(currentTime / duration) * 100}%`,
              backgroundColor: genreColor
            }}
          ></div>
          <input
            ref={progressBarRef}
            type="range"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onChange={handleProgressChange}
            aria-label="Seek time in track"
          />
        </div>
        <span className="text-sm w-12 text-right text-gray-600 dark:text-gray-400">{formatTime(duration)}</span>
      </div>

      {/* Additional controls */}
      <div className="flex items-center justify-between">
        {/* Volume control */}
        <div className="relative">
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full focus:outline-none"
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            onMouseEnter={() => setShowVolumeControl(true)}
            onMouseLeave={() => setShowVolumeControl(false)}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : volume < 0.5 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 9v6h4l5 5V4l-5 5H7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          {showVolumeControl && (
            <div
              className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 flex items-center"
              onMouseEnter={() => setShowVolumeControl(true)}
              onMouseLeave={() => setShowVolumeControl(false)}
            >
              <input
                type="range"
                className="w-24 accent-primary-500"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume control"
                style={{ accentColor: genreColor }}
              />
            </div>
          )}
        </div>

        {/* Playback rate control */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Speed:</span>
          <div className="flex space-x-1">
            {[0.5, 1, 1.5, 2].map(rate => (
              <button
                key={rate}
                onClick={() => handlePlaybackRateChange(rate)}
                className={`px-2 py-1 text-xs rounded ${playbackRate === rate
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                style={playbackRate === rate ? { backgroundColor: genreColor } : {}}
                aria-label={`Set playback speed to ${rate}x`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard shortcuts info */}
        <button
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full focus:outline-none group relative"
          aria-label="Keyboard shortcuts"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
          </svg>
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 hidden group-hover:block text-xs">
            <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
            <ul className="space-y-1">
              <li><span className="font-medium">Space:</span> Play/Pause</li>
              <li><span className="font-medium">←:</span> Rewind 5 seconds</li>
              <li><span className="font-medium">→:</span> Forward 5 seconds</li>
              <li><span className="font-medium">M:</span> Mute/Unmute</li>
            </ul>
          </div>
        </button>
      </div>
    </Card>
  )
}

export default AudioPlayer
