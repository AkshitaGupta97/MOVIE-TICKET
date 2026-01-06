import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import dateFormat from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { useClerk } from '@clerk/clerk-react';


function MyBooking() {

  const { axios, getToken, user, image_base_url} = useAppContext();
  const { openSignIn } = useClerk();

  const currency = import.meta.env.VITE_CURRENCY; // helps to import viteCurrency from .env

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async() => {
    /*setBookings(dummyBookingData)
    setIsLoading(false); 
    */
   try {
    const {data} = await axios.get('/api/user/bookings', {
      headers: {Authorization: `Bearer ${await getToken()}`}
    });
    if(data.success){
      setBookings(data.bookings);
    }
   } catch (error) {
    console.log(error);
   }
   setIsLoading(false)
  }

  useEffect(()=> {
    if(user){
      getMyBookings()
    }
  }, [user])

  if(!user){
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-amber-300">Please sign in to view your bookings.</p>
          <button onClick={openSignIn} className="px-6 py-2 bg-pink-600 rounded-full text-white">Sign in</button>
        </div>
      </div>
    )
  }

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-xl text-amber-300 font-semibold mb-4">My Bookings</h1>

      {
        bookings.map((item, index) => (
          <div key={index} className="flex flex-col mb-6 md:flex-row justify-between bg-gray-600 border-1 border-amber-300
            rounded-lg mt-4 p-2 max-w-3xl">
              <div className="flex flex-col md:flex-row">
                <img src={ image_base_url + item.show.movie.poster_path} alt="" className="md:max-w-xs aspect-video h-auto object-cover rounded" />
                <div className="flex flex-col p-4">
                  <p className="text-lg text-amber-300 font-semibold">{item.show.movie.title}</p>
                  <p className="text-gray-200 text-sm">{item.show.movie.runtime}</p>  {/* timeFormat(item.show.movie.runtime) */}
                  <p className="text-gray-200 text-sm mt-auto">{dateFormat(item.show.showDateTime)}</p>
                </div>
              </div>

              <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                <div className="flex items-center gap-4">
                  <p className="text-xl font-semibold mb-3">{currency}{item.amount}</p>
                  {
                    !item.isPaid && <button className="bg-pink-700 hover:bg-pink-800 px-4 py-1.5 mb-3 text-md rounded-full font-medium cursor-pointer">Pay Now</button>
                  }
                </div>
                <div className="text-sm">
                  <p className="text-orange-300 font-bold ml-0.5"><span className="text-gray-200">Total Tickets:</span>{item.bookedSeats.length}</p>
                  <p className="text-orange-300 font-bold ml-0.5"><span className="text-gray-200">Seat Number:</span>{item.bookedSeats.join(", ")}</p>
                </div>
              </div>

          </div>
        ))
      }

    </div>
  ) : (
    <Loading />
  )
}

export default MyBooking