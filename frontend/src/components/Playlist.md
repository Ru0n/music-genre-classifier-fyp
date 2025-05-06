# Playlist Component

The Playlist component displays genre-based playlists of classified audio files. It allows users to browse and play tracks organized by their predicted genres.

## Current Features

- Display a list of genres with track counts
- Select a genre to view its tracks
- Play tracks from the playlist
- Show appropriate empty states

## Component Structure

```jsx
const Playlist = () => {
  // State
  const [playlists, setPlaylists] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activePlaylist, setActivePlaylist] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  
  // Data fetching
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('/api/playlists')
        setPlaylists(response.data)
      } catch (error) {
        setError('Failed to load playlists')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlaylists()
  }, [])
  
  // Track playback
  const handlePlayTrack = (track) => {
    setCurrentTrack(`/api/audio/${track}`)
  }
  
  // Render component
  // ...
}
```

## Planned Enhancements

### UI Improvements

- [ ] Add genre-specific colors to playlist items
- [ ] Enhance the track list with additional metadata (duration, date added)
- [ ] Improve the audio player for the currently playing track
- [ ] Add animations for state transitions

### Functionality Enhancements

- [ ] Add sorting options (by name, date added, duration)
- [ ] Implement filtering by multiple genres
- [ ] Add search functionality for tracks
- [ ] Create playlist collections or favorites
- [ ] Add metadata display (total duration, etc.)

### Accessibility Improvements

- [ ] Enhance keyboard navigation
- [ ] Add ARIA attributes for screen readers
- [ ] Improve focus management
- [ ] Add keyboard shortcuts for common actions

## API Integration

The component interacts with the following API endpoints:

- `GET /api/playlists` - Fetches all playlists grouped by genre
- `GET /api/audio/:filename` - Streams audio for playback

## Usage

```jsx
import Playlist from './components/Playlist';

// Basic usage
<Playlist />

// Future planned props
<Playlist 
  initialGenre="rock"
  showSearch={true}
  maxHeight="600px"
/>
```

## Design Considerations

- The component uses a three-column layout on desktop:
  1. Genre list
  2. Track list for selected genre
  3. Now playing section (when a track is selected)
- On mobile, the layout adapts to a single column with expandable sections
- Empty states are provided for:
  - No playlists available
  - No tracks in a selected playlist
- Loading and error states are handled appropriately

## Related Components

- `AudioPlayer` - Used for playback of selected tracks
- `Card` - Container component for consistent styling
