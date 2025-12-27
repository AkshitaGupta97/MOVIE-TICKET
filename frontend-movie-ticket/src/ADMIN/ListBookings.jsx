import { useEffect, useState } from "react";
import { dummyShowData } from "../assets/dummyShowCard";
import { Loading } from "../components/Loading";

function ListBookings() {

  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const getAllBookings = async() => {
    setBookings(dummyShowData);
    setIsLoading(false);
  }

  useEffect(() => {
    getAllBookings()
  }, [])

  return !isloading ? (
    <div>
      <Title tetx1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-pink-600 text-left tetx-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
        </table>

      </div>
    </div>
  ) : <Loading />
}

export default ListBookings