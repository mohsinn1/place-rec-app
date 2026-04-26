import './App.css'
import MoodSelector from './components/MoodSelector'
import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import PlacesList from './components/PlacesList'


function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (err) => {
        setError(err.message)
      }
    )
  }, [])
  return (
    <div className='app'>
      <h2>What's your <br /> <span className='cyan-text'>vibe</span> today?</h2>
      <h3>Decide Where To Go</h3>
      <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
      <MapView position={position} error={error} />
      <PlacesList selectedMood={selectedMood} position={position} />
    </div>
  )
}

export default App
