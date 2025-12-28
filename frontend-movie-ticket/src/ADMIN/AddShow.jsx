import { useEffect, useState } from "react";
import { dummyShowData } from "../assets/dummyShowCard";
import { Loading } from "../components/Loading";
import Title from "../components/ADMIN/Title";
import { CheckIcon, StarIcon } from "lucide-react";
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

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 tetx-lg font-lg">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {
            nowPlayingMovies.map((movie) => (
              <div key={movie._id} onClick={() => setSelectedMovies(movie._id)}
                className={` relative max-w-40 cursor-pointer group-hover:not-hover:opacity-60 hover:-translate-y-1 transitation duration-300 `}>
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
                    <div className="absolute top-2 right-2 flx items-center justify-center bg-pink-600 h-6 w-6 rounded">
                      <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                  )
                }

              </div>
            ))
          }
        </div>
      </div>
    </>
  ) : 
  <Loading />
}

export default AddShow