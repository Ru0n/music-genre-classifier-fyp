import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import AudioUpload from './components/AudioUpload'
import ResultsDisplay from './components/ResultsDisplay'
import AudioPlayer from './components/AudioPlayer'
import Playlist from './components/Playlist'
import Card from './components/ui/Card'
import Button from './components/ui/Button'
import AnimatedWaveform from './components/ui/AnimatedWaveform'
import FloatingIcons from './components/ui/FloatingIcons'
import GenreVisualization from './components/ui/GenreVisualization'
import { Music, Volume2, ListMusic, Headphones } from 'lucide-react'

function App() {
  const [result, setResult] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('upload') // For mobile navigation: 'upload', 'results', 'playlists'
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check for user's preferred color scheme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Get genre color if result exists
  const getGenreColor = () => {
    if (!result) return '#3b82f6' // Default blue

    const genreColors = {
      blues: '#1e40af',     // Deep blue
      classical: '#0ea5e9',  // Light blue
      country: '#92400e',    // Brown
      disco: '#db2777',      // Pink
      hiphop: '#f97316',     // Orange
      jazz: '#8b5cf6',       // Purple
      metal: '#334155',      // Dark slate
      pop: '#ec4899',        // Pink
      reggae: '#65a30d',     // Green
      rock: '#e11d48',       // Red
    }

    return genreColors[result.genre] || '#3b82f6'
  }

  // Ref for scrolling to upload section
  const uploadSectionRef = useRef(null);

  // Function to scroll to upload section
  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black transition-colors duration-300 bg-noise">
      {/* Hero section with animated elements */}
<div className="relative overflow-hidden bg-dark-gradient min-h-screen flex items-center">
  {/* Animated gradient background */}
  <div className="absolute inset-0 bg-gradient-to-br from-dark-100 to-dark-50 dark:from-dark-50 dark:to-black animate-gradient-xy opacity-80"></div>
  <div className="absolute inset-0 bg-noise opacity-10"></div>

  {/* Floating music icons */}
  <FloatingIcons
    iconCount={12}
    color="rgba(255,255,255,0.2)"
    size={32}
  />

  <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 max-w-6xl">
    <div className="flex flex-col items-center text-center">
      {/* Large, bold typography with gradient text effect */}
      <motion.h1
        className="text-6xl md:text-8xl font-bold font-display tracking-tight mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-500">
          Music Genre
        </span>
      </motion.h1>

      <motion.h2
        className="text-5xl md:text-7xl font-bold font-display text-white/90 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Classifier
      </motion.h2>

      <motion.p
        className="text-xl md:text-2xl text-white/70 max-w-2xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Discover the genre of any music track with our AI-powered classifier
      </motion.p>

      {/* Animated waveform visualization */}
      <motion.div
        className="w-full max-w-md mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <AnimatedWaveform
          height={120}
          barCount={40}
          color="#3b82f6"
          secondaryColor="#8b5cf6"
        />
      </motion.div>

      {/* Single prominent CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Button
          variant="gradient"
          size="lg"
          glow
          className="px-10 py-5 text-lg font-semibold shadow-xl"
          onClick={scrollToUpload}
        >
          Classify Your Music
        </Button>
      </motion.div>
    </div>

    {/* Dark mode toggle */}
    <button
      onClick={toggleDarkMode}
      className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-md"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      )}
    </button>
  </div>
</div>

      {/* Features section */}
      <section className="py-16 bg-white/5 dark:bg-gray-900/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
              Features
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card variant="glass" hover className="p-6 text-center flex flex-col items-center h-full">
                <motion.div
                  className="w-16 h-16 rounded-full bg-primary-100/10 dark:bg-primary-900/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}
                >
                  <Music className="text-primary-500 h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 font-display">Instant Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Analyze any audio file in seconds
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card variant="glass" hover className="p-6 text-center flex flex-col items-center h-full">
                <motion.div
                  className="w-16 h-16 rounded-full bg-secondary-100/10 dark:bg-secondary-900/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}
                >
                  <Volume2 className="text-secondary-500 h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 font-display">Visual Insights</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  See detailed spectrograms and patterns
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card variant="glass" hover className="p-6 text-center flex flex-col items-center h-full">
                <motion.div
                  className="w-16 h-16 rounded-full bg-accent-100/10 dark:bg-accent-900/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)' }}
                >
                  <ListMusic className="text-accent-500 h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 font-display">Genre Playlists</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Organize music by detected genres
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Genre Visualization */}
      <section className="py-16 bg-gradient-to-br from-dark-50/5 to-dark-100/5 dark:from-dark-50/20 dark:to-dark-100/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
              Discover Music Genres
            </span>
          </motion.h2>

          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our classifier can identify 10 different music genres with high accuracy
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <GenreVisualization />
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl" ref={uploadSectionRef}>
        {/* Mobile navigation - improved with better styling */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center font-display"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
            Try It Yourself
          </span>
        </motion.h2>

        <div className="md:hidden flex justify-around mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-soft overflow-hidden border border-gray-100 dark:border-gray-700 animate-slide-up">
          <button
            className={`flex-1 py-3 text-center font-medium transition-all ${activeTab === 'upload' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-all ${activeTab === 'results' ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            onClick={() => setActiveTab('results')}
            disabled={!result}
            style={result && activeTab === 'results' ? { backgroundColor: getGenreColor() } : {}}
          >
            Results
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-all ${activeTab === 'playlists' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            onClick={() => setActiveTab('playlists')}
          >
            Playlists
          </button>
        </div>

        {/* Mobile content */}
        <div className="md:hidden">
          {activeTab === 'upload' && (
            <Card variant="glass" className="animate-scale-in">
              <h2 className="text-2xl font-semibold mb-4 font-display gradient-text inline-block">Upload Audio</h2>
              <AudioUpload
                setResult={setResult}
                setAudioFile={setAudioFile}
                setIsLoading={setIsLoading}
                setError={setError}
              />

              {audioFile && !result && (
                <div className="mt-6 animate-slide-up">
                  <h3 className="text-lg font-medium mb-2 font-display">Audio Preview</h3>
                  <AudioPlayer audioFile={audioFile} />
                </div>
              )}

              {isLoading && (
                <div className="mt-6 text-center animate-fade-in">
                  <p className="text-lg">Processing audio...</p>
                  <div className="mt-2 w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg backdrop-blur-sm border border-red-200 dark:border-red-800/30 animate-slide-up">
                  <p className="font-medium">Error: {error}</p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'results' && result && (
            <div className="space-y-6 animate-scale-in">
              <ResultsDisplay result={result} />

              <Card variant="glass">
                <h3 className="text-xl font-semibold mb-3 font-display gradient-text inline-block">Audio Player</h3>
                <AudioPlayer audioFile={audioFile} genreColor={getGenreColor()} />
              </Card>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="animate-scale-in">
              <h2 className="text-2xl font-semibold mb-4 font-display gradient-text inline-block">Genre Playlists</h2>
              <Playlist />
            </div>
          )}
        </div>

        {/* Desktop layout with improved styling */}
        <main className="hidden md:grid md:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="glass" hover className="backdrop-blur-md border border-white/10 dark:border-gray-800/30">
              <h2 className="text-2xl font-semibold mb-6 font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                Upload Audio
              </h2>
              <AudioUpload
                setResult={setResult}
                setAudioFile={setAudioFile}
                setIsLoading={setIsLoading}
                setError={setError}
              />

              {audioFile && !result && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-lg font-medium mb-2 font-display">Audio Preview</h3>
                  <AudioPlayer audioFile={audioFile} />
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-lg">Processing audio...</p>
                  <div className="mt-2 w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="mt-6 p-4 bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg backdrop-blur-sm border border-red-200 dark:border-red-800/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="font-medium">Error: {error}</p>
                </motion.div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card variant="glass" hover className="backdrop-blur-md border border-white/10 dark:border-gray-800/30 h-full">
              {result ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResultsDisplay result={result} />

                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <h3 className="text-lg font-medium mb-2 font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                      Audio Player
                    </h3>
                    <AudioPlayer audioFile={audioFile} genreColor={getGenreColor()} />
                  </motion.div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <motion.div
                    className="w-28 h-28 mb-6 bg-gradient-to-br from-primary-900/20 to-secondary-900/20 rounded-full flex items-center justify-center"
                    animate={{ boxShadow: ['0 0 0 rgba(59, 130, 246, 0.3)', '0 0 20px rgba(59, 130, 246, 0.5)', '0 0 0 rgba(59, 130, 246, 0.3)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Music className="w-14 h-14 text-primary-500/70 dark:text-primary-400/70" />
                  </motion.div>
                  <h2 className="text-2xl font-semibold mb-3 font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                    Classification Results
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                    Upload an audio file to see genre classification results with confidence scores and spectrogram visualization
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button
                      variant="gradient"
                      size="lg"
                      glow
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                    >
                      <Music className="mr-2 h-5 w-5" /> Upload Audio File
                    </Button>
                  </motion.div>
                </div>
              )}
            </Card>
          </motion.div>
        </main>

        <section className="mt-24 hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-6 font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
              Genre Playlists
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
              Explore our curated playlists organized by genre. Each playlist contains tracks that have been classified by our AI model.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Playlist />
          </motion.div>
        </section>

        <footer className="mt-24 pt-16 pb-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-800/20">
          <motion.div
            className="flex flex-col items-center justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className="w-10 h-10 mr-3 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/5 dark:to-secondary-500/5 rounded-xl flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}
              >
                <Headphones className="text-xl text-primary-500 dark:text-primary-400" />
              </motion.div>
              <h3 className="text-2xl font-bold font-display">
                Music <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Genre</span> Classifier
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              An interactive web application that uses machine learning to classify music genres from audio files
            </p>
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">React</motion.span>
              <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">TensorFlow</motion.span>
              <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Librosa</motion.span>
              <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Python</motion.span>
              <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">Tailwind CSS</motion.span>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center md:justify-between"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} Music Genre Classifier. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                href="#"
                className="text-gray-500 hover:text-primary-500 transition-colors"
                whileHover={{ scale: 1.05, y: -1 }}
              >
                About
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-500 hover:text-primary-500 transition-colors"
                whileHover={{ scale: 1.05, y: -1 }}
              >
                Privacy
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-500 hover:text-primary-500 transition-colors"
                whileHover={{ scale: 1.05, y: -1 }}
              >
                Contact
              </motion.a>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  )
}

export default App
