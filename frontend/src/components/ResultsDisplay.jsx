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
  if (!result) return null
  
  const { genre, confidence, spectrogram } = result
  
  // Prepare data for chart
  const chartData = {
    labels: Object.keys(confidence),
    datasets: [
      {
        label: 'Confidence Score',
        data: Object.values(confidence),
        backgroundColor: Object.keys(confidence).map(label => 
          label === genre ? 'rgba(54, 162, 235, 0.8)' : 'rgba(201, 203, 207, 0.8)'
        ),
        borderColor: Object.keys(confidence).map(label => 
          label === genre ? 'rgb(54, 162, 235)' : 'rgb(201, 203, 207)'
        ),
        borderWidth: 1
      }
    ]
  }
  
  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Genre Confidence Scores'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw
            return `Confidence: ${(value * 100).toFixed(2)}%`
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: (value) => `${(value * 100).toFixed(0)}%`
        }
      }
    }
  }
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Predicted Genre</h3>
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 capitalize">
            {genre}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Confidence: {(confidence[genre] * 100).toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Confidence Scores</h3>
        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">Spectrogram</h3>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          <img 
            src={`/api/spectrogram/${spectrogram}`} 
            alt="Audio Spectrogram" 
            className="w-full rounded"
          />
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay
