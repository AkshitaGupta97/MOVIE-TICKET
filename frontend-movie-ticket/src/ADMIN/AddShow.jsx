import { useEffect, useState } from "react";
import { dummyShowData } from "../assets/dummyShowCard";
import { Loading } from "../components/Loading";
import Title from "../components/ADMIN/Title";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { KConverter } from "../lib/KConverter";

function AddShow() {

  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState(null);
  const [dateTimeSelection, setDateTimeSelection]= useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowData);
  };

  const handleDateTimeAdd = () => {
    if(!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if(!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || []; //- Looks up the array of times for the given date in the previous state.If that date doesn’t exist yet, it defaults to an empty array [].
      if(!times.includes(time)){ //- Checks if the time you want to add is already present in the array
        return { ...prev, [date]: [...times, time]}; /*- If the time is not already included:
        - Spread prev to keep all existing dates and times.
        - Update the specific date key with a new array that contains. All the old times (...times). Plus the new time.}return prev;})
        */
      }
      return prev; //- If the time was already in the array, just return the unchanged state (prev).
    })
  }

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTime = prev[date].filter((t) => t != time);
      if(filteredTime.length === 0){
        const {[date]: _, ...rest} = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTime,
      }
    })
  }

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-lg">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {
            nowPlayingMovies.map((movie) => (
              <div key={movie._id} onClick={() => setSelectedMovies(movie._id)}
                className={` relative max-w-40 cursor-pointer group-hover:not-hover:opacity-70 hover:-translate-y-1 transitation duration-300 `}>
                <div className="relative rounded-lg overflow-hidden">
                  <img src={movie.poster_path} alt="poster" className="w-full object-cover brightness-90" />
                  <div className="text-sm flex items-center justify-between p-2 bg-gray-900 w-full absolute bottom-0 left-0 ">
                    <p className="flex items-center gap-1 text-gray-500">
                      <StarIcon className="w-6 h-6 text-amber-500 fill-amber-300" />
                      {movie.vote_average.toFixed(1)}
                    </p>
                    <p>{KConverter(movie.runtime)} Votes</p>  {/* {movie.vote_count} */}
                  </div>
                </div>

                {
                  selectedMovies === movie._id && (
                    <div className="absolute top-2 right-2 flex items-center justify-center bg-pink-600 h-6 w-6 rounded">
                      <CheckIcon className="w-4 h-4 text-center text-white" strokeWidth={2.5} />
                    </div>
                  )
                }
                <p className="font-medium text-pink-200 truncate">{movie.title}</p>
                <p className="text-gray-400 text-lg">{movie.release_date}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* show Price Input */}
      <div className="mt-8">
          <label className="block text-lg text-amber-300 font-medium mb-2" >Show Price</label>
          <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
            <p className="text-gray-500 text-lg">{currency}</p>
            <input type="number" min={0} value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="Enter show price" className="outline-none"  />
          </div>
      </div>

      {/* Date and Time selection */}

        <div className="mt-6">
          <label className="block tetx-lg text-amber-300 font-medium mb-2">Select Date and Time</label>
          <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
            <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} 
            className="outline-none rounded-md" />
            <button onClick={handleDateTimeAdd} 
              className="bg-pink-700 text-white px-3 py-2 text-sm rounded-lg hover:bg-pink-700 cursor-pointer">
                Add Time
            </button>
          </div>
        </div>

      {/* Display Selected Times */}
        {
          Object.keys(dateTimeSelection).length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-amber-300 text-lg">Selected Date-Time</h2>
              <ul className="space-y-3">
                {
                  Object.entries(dateTimeSelection).map(([date, times]) => (
                    <li key={date} className="border border-gray-400 rounded-md p-4 inline-flex items-center gap-1.5 flex-col ml-2">
                      <div className="font-medium text-orange-300">{date}</div>
                      <div className="flex flex-wrap gap-2 mt-1 text-lg">
                        {
                          times.map((time) => (
                            <div className="border border-pink-600 px-2 py-1 flex items-center rounded">
                              <span>{time}</span>
                              <DeleteIcon onClick={() => handleRemoveTime(date, time)} width={24} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" />
                            </div>
                          ))
                        }
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
        <button className="bg-pink-700 text-white px-8 py-2 mt-6 rounded hover:bg-pink-800 transition-all cursor-pointer">
          Add Show
        </button>

    </>
  ) : 
  <Loading />
}

export default AddShow

/*
handleDateTimeAdd
dateTimeSelection = {
  "2025-12-28": ["14:00"]
}
Call with date = "2025-12-28" and time = "15:40":
- times = ["14:00"]
- "15:40" is not included → add it
- New state becomes:
{
  "2025-12-28": ["14:00", "15:40"]
}If you call again with the same time = "15:40", nothing changes because it’s already included.
******
- Splits the input string at "T".
- Example: "2025-12-28T15:40" → date = "2025-12-28", time = "15:40".
- If either part is missing, it exits.
***
setDateTimeSelection((prev) => {
- Calls the React state updater function setDateTimeSelection.
- Passes in a callback that receives the previous state (prev).
- This ensures updates are based on the latest state.
const filteredTime = prev[date].filter((t) => t != time);
- Looks up the array of times for the given date in the state.
- Uses .filter() to create a new array that excludes the time we want to remove.
- Example: ["14:00", "15:40"].filter(t => t != "15:40") → ["14:00"].
if(filteredTime.length === 0){
- Checks if the new array of times is empty.
- Meaning: after removal, there are no times left for that date.
const {[date]: _, ...rest} = prev;
return rest;
***
- This is object destructuring with rest:
- {[date]: _, ...rest} removes the property with key date from prev.
- _ is just a throwaway variable (we don’t need the value).
- rest contains all the other dates and their times.
- Returns rest, which is the new state without that date key.

}
  return {
    ...prev,
    [date]: filteredTime,
  }
- If there are still times left for that date:
- Spread prev to keep all existing dates.
- Replace the array for this specific date with the updated filteredTime.
- Returns the new state object.

const prev = {
  "2025-12-28": ["14:00"],
  "2025-12-29": ["10:00"]
};
const { ["2025-12-28"]: _, ...rest } = prev;
console.log(rest);
// Output: { "2025-12-29": ["10:00"] }


  <ul className="space-y-3">
  { Object.entries(dateTimeSelection).map(([date, times]) => (
- Object.entries(dateTimeSelection) converts the state object into an array of [date, times] pairs.
- Example: { "2025-12-28": ["14:00", "15:40"] } → [["2025-12-28", ["14:00", "15:40"]]].
- .map() loops through each date and its times.


*/