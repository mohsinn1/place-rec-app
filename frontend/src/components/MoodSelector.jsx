import { LuCoffee, LuTrees, LuFilm } from 'react-icons/lu'
import { MdFamilyRestroom } from 'react-icons/md'
import { GiLoveLetter } from "react-icons/gi";
import { IoFastFoodOutline } from "react-icons/io5";

const moods = [
    { id: 'cafes', icon: LuCoffee, label: 'Cafes', description: 'Coffee & WiFi' },
    { id: 'foodie', icon: GiLoveLetter, label: 'Foodie', description: 'For the Food Lovers' },
    { id: 'outdoors', icon: LuTrees, label: 'Outdoors', description: 'Parks & Nature' },
    { id: 'fast_food', icon: IoFastFoodOutline, label: 'Fast Food', description: 'Quick Bites' },
    { id: 'chill', icon: LuFilm, label: 'Chill', description: 'Movies & Relaxation' },
]

function MoodSelector({ selectedMood, onMoodSelect }) {
    return (
        <div className='mood-selector'>
            <h2>What's your <br /> <span className='cyan-text'>vibe</span> today?</h2>
            <div className='mood-grid'>
                {moods.map((mood) => (
                    <button
                        key={mood.id}
                        className={`mood-btn ${selectedMood === mood.label ? 'active' : ''}`}
                        onClick={() => onMoodSelect(mood.label)}
                    >
                        <div className='mood-text'>
                            <span className='mood-label'>{mood.label}</span>
                            <span className='mood-desc'>{mood.description}</span>
                        </div>
                        <mood.icon className='mood-icon' size={30} />
                    </button>
                ))}
            </div>
            {
                selectedMood && (
                    <p className="selected-text">
                        Selected: <span className='cyan-text'>{selectedMood}</span>
                    </p>
                )
            }
        </div >
    )
}

export default MoodSelector;