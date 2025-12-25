import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { dummyShowData } from "../assets/dummyShowCard";
import dummyDateTimeData from "../assets/dummyDateTimeData";
import { Loading } from "../components/Loading";
import { ClockIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle"
import toast from "react-hot-toast";
//import { isoTimeFormat } from "../lib/isoTimeFormat";

function SeatLayout() {
  
  const {id, date} = useParams();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']]

  const navigate = useNavigate();

  const getShow = async () => {
    const showdata = dummyShowData.find(show => show._id === id);
    if(showdata){
      setShow({
        movie: show, 
        dateTime: dummyDateTimeData
      })
    }
  }

  const handleSeatClick = (seatId) => {
    if(!selectedTime){
      return toast("Please selct the time...")
    }
    if(!selectedSeat.includes(seatId) && selectedSeat.length > 5) {
      return toast("You can only select 5 seats...")
    }
    setSelectedSeat(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  {/* created component for seats */}
  const renderSeats = (row, count = 9) =>(
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {
          Array.from({length: count}, (_, i) => {
            const seatId = `${row}${i+1}`;
            return(
              <button key={seatId} onClick={() => handleSeatClick(seatId)}
              className={`h-10 w-10 rounded border border-pink-600 cursor-pointer 
              ${selectedSeat.includes(seatId) && "bg-pink-600 text-white"}`}>
                  {seatId}
              </button>
            )
          })
        }
      </div>
    </div>
  )

  useEffect(() => {
    getShow()
  }, [])

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available timing */}
      <div className="w-60 bg-gray-600 border border-amber-400 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {
            show.dateTime[date].map((item) => (
              <div  key={item.time} onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition
                ${selectedTime?.time === item.time ? "bg-pink-600 text-white" : "hover:bg-pink-700"}`}>
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{item.time}</p> {/* {isoTimeFormat(item.time)} */}
              </div>
            ))
          }
        </div>
      </div>

      {/* Seat layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
          <BlurCircle top="-100px" left="-100px" />
          <BlurCircle bottom="0" right="0" />
          <h1 className="text-2xl text-amber-300 font-semibold mb-4">Select your seat</h1>
          <img src="https://tse3.mm.bing.net/th/id/OIP.jQ16UVHAVAH5T1yddtDa1QHaDF?rs=1&pid=ImgDetMain&o=7&rm=3" alt="scren" />
          <p className="text-orange-400 mt-1.5 text-sm mb-6">SCREEN SIDE</p>

          <div className="flex flex-col items-centermt-10 text-xs text-gray-300">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
              {
                groupRows[0].map(row => renderSeats(row))
              }
            </div>
          </div>

      </div>

    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout

/*
- id and date come from the URL (e.g., /seatlayout/123/2025-01-07).
- selectedSeat: array of chosen seats.
- selectedTime: which time slot the user clicked.
- show: holds the current movie/show data.
- navigate: lets you redirect to another page.

- getShow finds the show by its _id from dummyShowData.
- If found, it sets show state with two properties:
- movie: the actual show object.
- dummyDateTimeData: the mock timings.
- useEffect runs once when the component mounts.

show.dateTime[date].map(...)
- show.dateTime is an object that contains available timings grouped by date.
- date comes from the URL parameter (e.g., "2025-01-07").
- show.dateTime[date] gives you the array of time slots for that specific date.
- .map(...) loops through each time slot (item) in that array and returns JSX for it.


*/