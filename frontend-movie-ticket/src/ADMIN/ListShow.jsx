import { useEffect, useState } from "react";
import { dummyShowData } from "../assets/dummyShowCard";
import { Loading } from "../components/Loading";
import Title from "../components/ADMIN/Title";

function ListShow() {

  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      setShows([{
        movie: dummyShowData[0],
        showDateTime: "2025-04-07",
        showPrice: 60,
        occupiedSeats: {
          A1: "user_1",
          B1: "user_2",
          C1: "user_3"
        }
      }]);
      setLoading(false)
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllShows();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-2xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-pink-600 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>
          
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListShow