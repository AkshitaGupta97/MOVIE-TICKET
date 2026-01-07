import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
//import { dummyShowData } from "../assets/dummyShowCard";
//import dummyDateTimeData from "../assets/dummyDateTimeData";
import { Loading } from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle"
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
//import { isoTimeFormat } from "../lib/isoTimeFormat";

function SeatLayout() {

  const { id, date } = useParams();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]); // New state for occupied seats

  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']]

  const navigate = useNavigate();

  const { axios, getToken, user} = useAppContext();

  const getShow = async () => {
   /* const showdata = dummyShowData.find(show => show._id === id);
    if (showdata) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData
      })
    }*/
   try {
    const {data} = await axios.get(`/api/show/${id}`);
    if(data.success){
      setShow(data);
    }
   } catch (error) {
    console.log(error);
   }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please selct the time...")
    }
    if (!selectedSeat.includes(seatId) && selectedSeat.length > 5) {
      return toast("You can only select 6 seats...")
    }
    if(occupiedSeats.includes(seatId)){
      return toast.error("Seat already occupied. Please select a different seat.");
    }
    setSelectedSeat(prev =>
      prev.includes(seatId) ?
        prev.filter(seat => seat !== seatId) :  //remove the seat if it’s already selected.
        [...prev, seatId]
    )
  }

  /*
    2. prev.includes(seatId)
    - Checks if the seat the user clicked (seatId) is already in the array.
    - Example: if prev = ["A1", "A2"] and seatId = "A2", then prev.includes("A2") is true.
    3. prev.filter(seat => seat !== seatId)
    - Purpose: remove the seat if it’s already selected.
    - prev is your current array of selected seats.
    - .filter(...) loops through each seat in prev and keeps only those that are not equal to seatId.
    - Example:
    - prev = ["A1", "A2", "A3"]
    - seatId = "A2"
    - Result = ["A1", "A3"] (because "A2" was filtered out).
    4 - Purpose: add the seat if it’s not already selected.
    - [...prev] spreads the existing array (copies all current seats).
    - seatId is appended at the end.
    - Example:
    - prev = ["A1", "A2"]
    - seatId = "A3"
    - Result = ["A1", "A2", "A3"].

  */

    
  // store occupied seat in state variable
  const getOccupiedSeats = async() => {
    try {
      const {data} = await axios.get(`/api/booking/seats/${selectedTime.showId}`); // showId comes from selectedTime, which is set when user clicks a time slot, which comes from show.dateTime[date], e.g: /api/booking/seats/64a7 
      if(data.success){
        setOccupiedSeats(data.occupiedSeats); // assuming data.occupiedSeats is an array of occupied seat IDs. how do we get occupiedSeats from backend? check bookingController.js getOccupiedSeats function
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // call getOccupiedSeats whenever selectedTime changes
  useEffect(() => {
    if(selectedTime){
      getOccupiedSeats();
    }
  }, [selectedTime]);

  // book tickets
  const bookTickets = async() => {
    try {
      if(!user) return toast.error("Please login to book tickets");

      if(!selectedTime || !selectedSeat.length){
        return toast.error("Please select time and seats to proceed");
      } 

      // debug: log payload before sending
      console.log('Booking payload:', { showId: selectedTime?.showId, selectedSeats: selectedSeat });

      const {data} = await axios.post('/api/booking/create',
        {
          showId: selectedTime.showId,
          selectedSeats: selectedSeat
        },
        {
          headers: {Authorization: `Bearer ${await getToken()}`}
        }
      );
      if(data.success){
       /* toast.success(data.message);
        navigate("/my-bookings");*/
        // adding stripe payment method
        window.location.href = data.url; // redirect to stripe payment page
      }

    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message || error);
      const msg = error.response?.data?.message || error.message || "Failed to book tickets. Please try again.";
      toast.error(msg);
    }
  }

  {/* created component for seats */ }
  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {
          Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            return (
              <button key={seatId} onClick={() => handleSeatClick(seatId)}
                className={`h-10 w-10 rounded border border-pink-600 cursor-pointer 
                  ${occupiedSeats.includes(seatId) ? "bg-gray-600 cursor-not-allowed" :
                    selectedSeat.includes(seatId) ? "bg-pink-600 text-white" : "cursor-pointer"
                  }
                `}>
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
              <div key={item.time} onClick={() => setSelectedTime(item)}
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

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">

          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {
              groupRows[0].map(row => renderSeats(row))
            }
          </div>

          <div className="grid grid-cols-2 gap-11">
            {
              groupRows.slice(1).map((group, idx) => (
                <div key={idx}>
                  {
                    group.map(row => renderSeats(row))
                  }
                </div>
              ))
            }
          </div>
        </div>

        <button onClick={bookTickets}
        className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-pink-600 hover:bg-pink-700 transition rounded-full 
        font-medium cursor-pointer active:scale-95">
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={4} className="w-4 h-4" />
        </button>
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

renderSeats
Array.from({length: count}, (_, i) => { ... })
- Creates a new array with count elements (e.g., 9 seats in a row).
- The second argument is a mapping function that runs for each index.
- (_, i) → _ is the unused placeholder for the element, i is the index (0, 1, 2…)

const seatId = \row{i+1}`;`
- Builds a seat identifier string.
- row is the row letter (e.g., "A").
- i+1 makes seat numbers start at 1 instead of 0.
- Example: if row = "A" and i = 0, seatId = "A1".

calling renderSeats
- groupRows[0] → the first sub-array: ['A', 'B'].
- .map(row => renderSeats(row)) → loops through that array and calls renderSeats for each row.
- So it renders seats for row "A" and row "B".

second rerenderSeat
- .map((group, idx) => ...) → loops through each sub-array (['C','D'], ['E','F'], etc.).
- group → one of those sub-arrays.
- idx → the index of the group in this sliced array (0, 1, 2, 3).

group.map(row => renderSeats(row))
- Loops through each row in the group.
- Example: if group = ['C','D'], then:
- First iteration → row = 'C', calls renderSeats('C').
- Second iteration → row = 'D', calls renderSeats('D').
- renderSeats(row) → generates the seat buttons for that row.

*/