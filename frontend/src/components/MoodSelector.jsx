import { LuCoffee, LuFilm } from 'react-icons/lu'
import { MdOutlinePark, MdOutlineFastfood, MdOutlineNightlight } from 'react-icons/md'
import { GiLoveLetter } from "react-icons/gi";

const moods = [
    { id: 'cafes', icon: LuCoffee, label: 'Cafes', description: 'Coffee & WiFi' },
    { id: 'foodie', icon: GiLoveLetter, label: 'Foodie', description: 'For the Food Lovers' },
    { id: 'outdoors', icon: MdOutlinePark, label: 'Outdoors', description: 'Parks & Nature' },
    { id: 'fast_food', icon: MdOutlineFastfood, label: 'Fast Food', description: 'Quick Bites' },
    { id: 'chill', icon: MdOutlineNightlight, label: 'Chill', description: 'Movies & Relaxation' },
]

function MoodSelector({ selectedMood, onMoodSelect }) {
    return (
        <div className='mood-selector'>
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
                        <mood.icon className='mood-icon' size={35} />
                    </button>
                ))}
            </div>
            {
                selectedMood && (
                    <p className="selected-text">
                        Selected: <span className='selected-mood'>{selectedMood}</span>
                    </p>
                )
            }
        </div >
    )
}

export default MoodSelector;