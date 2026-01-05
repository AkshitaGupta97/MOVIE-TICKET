import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import adminDummyDashboardData from "../assets/adminDummyDashboardData";
import Title from "../components/ADMIN/Title";
import { useAppContext } from "../context/AppContext";

function ListBookings() {

  const {axios, getToken, user} = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const getAllBookings = async() => {
    //setBookings(adminDummyDashboardData);
    try {
      const {data} = await axios.get('/api/admin/all-bookings', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      });
      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if(user) {
      getAllBookings()
    }
  }, [user])

  return !isloading ? (
    <div>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-pink-800 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>

          <tbody className="text-lg font-medium">
            {
              (bookings || []).map((item, index) => (
                <tr key={item._id || index} className="border-b border-amber-300 bg-gray-600 even:bg-cyan-950">
                  <td className="p-2 min-w-45 pl-5">{item.user?.name || '—'}</td>
                  <td className="p-2">{item.show?.movie?.title || '—'}</td>
                  <td className="p-2">{item.show?.showDateTime ? new Date(item.show.showDateTime).toLocaleString('en-IN', {dateStyle:'short', timeStyle:'short'}) : '—'}</td>
                  <td className="p-2">{Array.isArray(item.bookedSeats) ? item.bookedSeats.map(seat => seat.seatNo || seat).join(', ') : '—'}</td>
                  <td className="p-2">{currency} {item.amount ?? item.show?.showPrice ?? '0'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>

      </div>
    </div>
  ) : <Loading />
}

export default ListBookings

// {Object.keys(item.bookedSeats).map(seat => bookedSeats[seat]).join(", ")}