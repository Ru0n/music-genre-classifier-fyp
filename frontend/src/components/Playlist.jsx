import { useState, useEffect } from 'react'
import axios from 'axios'

const Playlist = () => {
  const [playlists, setPlaylists] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activePlaylist, setActivePlaylist] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('/api/playlists')
        setPlaylists(response.data)
      } catch (error) {
        console.error('Error fetching playlists:', error)
        setError('Failed to load playlists')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlaylists()
  }, [])
  
  const handlePlayTrack = (track) => {
    setCurrentTrack(`/api/audio/${track}`)
  }
  
  if (loading) {
    return (
      <div className="text-center p-8">
        <p>Loading playlists...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    )
  }
  
  const playlistGenres = Object.keys(playlists)
  
  if (playlistGenres.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No playlists available. Upload and classify some songs to create playlists.
        </p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Genres</h3>
        <ul className="space-y-2">
          {playlistGenres.map((genre) => (
            <li key={genre}>
              <button
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  activePlaylist === genre
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActivePlaylist(genre)}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize">{genre}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {playlists[genre].length} tracks
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        {activePlaylist ? (
          <>
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {activePlaylist} Playlist
            </h3>
            
            {playlists[activePlaylist].length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {playlists[activePlaylist].map((track, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className="mr-3 w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full focus:outline-none"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                        <span className="truncate max-w-xs">{track}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No tracks in this playlist
              </p>
            )}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <p className="text-gray-500 dark:text-gray-400">
              Select a genre to view its playlist
            </p>
          </div>
        )}
      </div>
      
      {currentTrack && (
        <div className="md:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Now Playing</h3>
          <audio 
            src={currentTrack} 
            controls 
            className="w-full" 
            autoPlay
          />
        </div>
      )}
    </div>
  )
}

export default Playlist
