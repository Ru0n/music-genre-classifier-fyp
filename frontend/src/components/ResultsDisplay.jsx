import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import Card from './ui/Card'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ResultsDisplay = ({ result }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  if (!result) return null

  const { genre, confidence, spectrogram } = result

  // Get genre-specific color from Tailwind config
  const getGenreColor = (genreName, opacity = 1) => {
    const genreColors = {
      blues: `rgba(30, 64, 175, ${opacity})`,     // Deep blue
      classical: `rgba(14, 165, 233, ${opacity})`,  // Light blue
      country: `rgba(146, 64, 14, ${opacity})`,    // Brown
      disco: `rgba(219, 39, 119, ${opacity})`,      // Pink
      hiphop: `rgba(249, 115, 22, ${opacity})`,     // Orange
      jazz: `rgba(139, 92, 246, ${opacity})`,       // Purple
      metal: `rgba(51, 65, 85, ${opacity})`,      // Dark slate
      pop: `rgba(236, 72, 153, ${opacity})`,        // Pink
      reggae: `rgba(101, 163, 13, ${opacity})`,     // Green
      rock: `rgba(225, 29, 72, ${opacity})`,       // Red
    }

    return genreColors[genreName] || `rgba(107, 114, 128, ${opacity})` // Default gray if genre not found
  }

  // Prepare data for chart
  const chartData = {
    labels: Object.keys(confidence),
    datasets: [
      {
        label: 'Confidence Score',
        data: Object.values(confidence),
        backgroundColor: Object.keys(confidence).map(label =>
          getGenreColor(label, 0.7)
        ),
        borderColor: Object.keys(confidence).map(label =>
          getGenreColor(label, 1)
        ),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  }

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Genre Confidence Scores',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw
            return `Confidence: ${(value * 100).toFixed(2)}%`
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          callback: (value) => `${(value * 100).toFixed(0)}%`,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    // Add hover effects
    onHover: (event, chartElements) => {
      if (event && event.native) {
        event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default'
      }
    },
    onClick: (event, chartElements) => {
      if (chartElements.length > 0) {
        const index = chartElements[0].index
        const genreName = Object.keys(confidence)[index]
        setSelectedGenre(selectedGenre === genreName ? null : genreName)
      }
    }
  }

  // Get genre description
  const getGenreDescription = (genreName) => {
    const descriptions = {
      blues: "Blues is characterized by blue notes, call-and-response patterns, and specific chord progressions, typically with a 12-bar structure.",
      classical: "Classical music is art music produced or rooted in the traditions of Western culture, typically with complex compositions and formal musical structure.",
      country: "Country music often consists of ballads and dance tunes with generally simple forms, folk lyrics, and harmonies accompanied by instruments such as banjos, guitars, and fiddles.",
      disco: "Disco is a genre of dance music characterized by a steady beat, syncopated basslines, and often orchestral instruments, synthesizers, and electric piano.",
      hiphop: "Hip hop music is characterized by stylized rhythmic music that commonly accompanies rapping, rhythmic and rhyming speech.",
      jazz: "Jazz is characterized by swing and blue notes, complex chords, call and response vocals, polyrhythms and improvisation.",
      metal: "Metal is characterized by distorted guitars, emphatic rhythms, dense bass-and-drum sound, and often virtuosic instrumental playing.",
      pop: "Pop music is characterized by an aim of appealing to a general audience, rather than to a particular sub-culture, with an emphasis on craftsmanship and recording over live performance.",
      reggae: "Reggae is characterized by a strong rhythmic pattern, with accents on the off-beat, often with the use of a skank rhythm played on the guitar.",
      rock: "Rock music is characterized by a strong beat, simple chord structure, and often played loudly with guitars, drums, and vocals."
    }

    return descriptions[genreName] || "No description available for this genre."
  }

  return (
    <div className="animate-fade-in">
      <Card className="mb-6 overflow-hidden border-l-4" style={{ borderLeftColor: getGenreColor(genre) }}>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 font-display">Predicted Genre</h3>
            <p className="text-3xl font-bold capitalize mb-1" style={{ color: getGenreColor(genre) }}>
              {genre}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Confidence: {(confidence[genre] * 100).toFixed(2)}%
            </p>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {getGenreDescription(genre)}
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${getGenreColor(genre, 0.15)}` }}
            >
              <svg
                className="w-10 h-10 md:w-12 md:h-12"
                style={{ color: getGenreColor(genre) }}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 font-display" id="confidence-chart">Confidence Scores</h3>
        <div
          className="h-80"
          aria-labelledby="confidence-chart"
          role="img"
          aria-label={`Bar chart showing confidence scores for each genre. ${genre} has the highest score at ${(confidence[genre] * 100).toFixed(2)}%`}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>

        {selectedGenre && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${getGenreColor(selectedGenre, 0.1)}` }}>
            <h4 className="font-medium capitalize mb-1" style={{ color: getGenreColor(selectedGenre) }}>
              {selectedGenre}
            </h4>
            <p className="text-sm">
              {getGenreDescription(selectedGenre)}
            </p>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4 font-display">Spectrogram</h3>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg overflow-hidden">
          <img
            src={`/api/spectrogram/${spectrogram}`}
            alt="Audio Spectrogram visualization showing frequency distribution over time"
            className="w-full rounded transition-transform hover:scale-[1.02] cursor-zoom-in"
          />
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          A spectrogram is a visual representation of the spectrum of frequencies in the audio signal as they vary with time.
          Different music genres often have distinctive patterns in their spectrograms.
        </p>
      </Card>
    </div>
  )
}

export default ResultsDisplay
