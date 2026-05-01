import './App.css'
import MoodSelector from './components/MoodSelector'
import { useState, useEffect, lazy, Suspense } from 'react'
const MapView = lazy(() => import('./components/MapView'));
const PlacesList = lazy(() => import('./components/PlacesList'));


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
      <Suspense><MapView position={position} error={error} /></Suspense>
      {selectedMood && <Suspense><PlacesList selectedMood={selectedMood} position={position} /></Suspense>}
    </div>
  )
}

export default App
