import { useEffect, useState } from "react";
//import { dummyShowData } from "../assets/dummyShowCard";
import { Loading } from "../components/Loading";
import Title from "../components/ADMIN/Title";
import { useAppContext } from "../context/AppContext";

function ListShow() {

  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const {axios, getToken, user} = useAppContext();

  const getAllShows = async () => {
    try {
     /* setShows([{
        movie: dummyShowData[0],
        showDateTime: "2025-04-07",
        showPrice: 60,
        occupiedSeats: {
          A1: "user_1",
          B1: "user_2",
          C1: "user_3"
        }
      }]);*/

      const {data} = await axios.get('/api/show/all', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      });
      setShows(data.shows || []);
      setLoading(false)
    }
    catch (error) {
      console.error(error);
      setShows([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    if(user){
      getAllShows();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-pink-600 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>
          
          <tbody className="text-sm font-medium">
            {
              shows.map((show, index) => (
                <tr key={index} className="border-b border-amber-300 bg-gray-500 even:bg-gray-400">
                  <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                  <td className="p-2">{new Date(show.showDateTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                  <td className="p-2">{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                </tr>
              ))
            }
          </tbody>

        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListShow