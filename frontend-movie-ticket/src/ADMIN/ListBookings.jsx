import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import adminDummyDashboardData from "../assets/adminDummyDashboardData";

function ListBookings() {

  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const getAllBookings = async() => {
    setBookings(adminDummyDashboardData);
    setIsLoading(false);
  }

  useEffect(() => {
    getAllBookings()
  }, [])

  return !isloading ? (
    <div>
      <Title textt1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-pink-600 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>

          <tbody className="text-lg font-medium">
            {
              bookings.activeShows.map((item, index) => (
                <tr key={index} className="border-b border-pink-600 bg-pink-600 even:bg-pink-600">
                  <td className="p-2 min-w-45 pl-5">{item.username}</td>
                  <td className="p-2">{item.movie.title}</td>
                  <td className="p-2">{item.showDateTime}</td>
                  <td className="p-2">{item.bookedSeats.map(seat => `${seat.seatNo} (${seat.type})`).join(', ')}</td>
                  <td className="p-2">{currency} {item.showPrice}</td>

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