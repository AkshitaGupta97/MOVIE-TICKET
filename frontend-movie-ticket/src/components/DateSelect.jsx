import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import BlurCircle from "./BlurCircle"
import { useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const DateSelect = ({dateTime, id}) => {

    const [selected, setSelected] = useState(null);  // Keeps track of which date the user clicked.
    const navigate = useNavigate();

    const onBookHandler = () => {
        if(!selected) {  //If no date is chosen → shows a toast message.
            return toast("Please select a date...")
        }
        navigate(`/movies/${id}/${selected}`) // navigates to a booking page for that movie and date.
        scrollTo(0,0);
    }

  return (
    <div id="dateSelect" className="pt-30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 
        relative p-8 bg-gray-600 brder border-pink-800 rounded-lg">
            <BlurCircle top="-100px" left="-100px" />
            <BlurCircle top="100px" right="0px" />
            <div >
                <p className="text-2xl text-amber-400 font-semibold">Choose Date</p>
                <div className="flex items-center gap-6 text-sm mt-5">
                    <ChevronLeftIcon width={36} />
                    <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                        {
                            Object.keys(dateTime).map((date) => (  // - Loops through all keys in dateTime (which are date strings like "2025-01-05").
                                <button key={date} onClick={() => setSelected(date)}
                                className={`flex flex-col items-center justify-center
                                h-14 w-14 aspect-square rounded cursor-pointer 
                                ${selected === date ? "bg-primary text-white" : "border border-primary"} `}>
                                    <span>{new Date(date).getDate()}</span>  {/* Day of the month - getDate()*/}
                                    <span>{new Date(date).toLocaleDateString("en-US",  
                                        {month:"short"})}</span>
                                </button>
                            ))
                        }
                    </span>
                    <ChevronRightIcon width={36} />
                </div>
            </div>
            <button onClick={onBookHandler}
            className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 
            transition-all cursor-pointer">
                Book Now
            </button>
        </div>
    </div>
  )
}

export default DateSelect