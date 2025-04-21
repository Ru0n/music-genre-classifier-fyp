import { useState } from 'react'
import AudioUpload from './components/AudioUpload'
import ResultsDisplay from './components/ResultsDisplay'
import AudioPlayer from './components/AudioPlayer'
import Playlist from './components/Playlist'

function App() {
  const [result, setResult] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Music Genre Classifier</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Upload an audio file to classify its genre using machine learning
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Upload Audio</h2>
          <AudioUpload 
            setResult={setResult} 
            setAudioFile={setAudioFile} 
            setIsLoading={setIsLoading}
            setError={setError}
          />
          
          {audioFile && !result && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Audio Preview</h3>
              <AudioPlayer audioFile={audioFile} />
            </div>
          )}
          
          {isLoading && (
            <div className="mt-6 text-center">
              <p className="text-lg">Processing audio...</p>
              <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="animate-pulse h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {result ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Classification Results</h2>
              <ResultsDisplay result={result} />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Audio Player</h3>
                <AudioPlayer audioFile={audioFile} />
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-semibold mb-4">Classification Results</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Upload an audio file to see classification results
              </p>
            </div>
          )}
        </div>
      </main>
      
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Genre Playlists</h2>
        <Playlist />
      </section>
      
      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
        <p>
          Interactive Music Genre Classifier &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

export default App
