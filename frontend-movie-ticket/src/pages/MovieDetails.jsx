import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { dummyShowData } from "../assets/dummyShowCard";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import dummyDateTimeData from "../assets/dummyDateTimeData";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import { Loading } from "../components/Loading";

function MovieDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // to get id from url
  const [show, setShow] = useState(null);

  // fetch show from id and store it in variable
  const getShow = async () => {
    const showdata = dummyShowData.find(show => show._id === String(id));
    if (showdata) {
      setShow({
        movie: showdata,
        dateTime: dummyDateTimeData,
      })
    }
  }

  useEffect(() => {
    getShow();
  }, [id])

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto ">

        <img src={show.movie.poster_path} alt="poster" className="max-md:mx-auto rounded-xl h-100 max-w-70 object-cover" />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-amber-300">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-90 text-balance">{show.movie.title}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-amber-400 fill-amber-300" />
            {show.movie.vote_average.toFixed(1)} <span className="text-orange-200">User Rating</span>
          </div>
          <p>{show.movie.overview}</p>
          <p>
            {timeFormat(show.movie.runtime)} {show.movie.genres.map(genre => genre.name).join(", ")}
            {show.movie.release_date.split("-")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 
              transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a href="#dateSelect" className="px-10 py-3 text-sm bg-pink-500 hover:bg-pink-600 transition rounded-md 
            font-medium cursor-pointer active:scale-95">Buy Tickets</a>
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className={`w-5 h-5`} />
            </button>

          </div>

        </div>

      </div>

      <p className="text-2xl text-amber-400 font-medium mt-20">Favourite Cast ....</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          <BlurCircle top="200px" right="4px" />
          {
            show.movie.casts.map((cast, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <img src={cast.profile_path} alt="casts_image" className="rounded-full h-28 md:h-28 aspect-square  object-cover" />
                <p className="font-medium text-lg mt-3">{cast.name}</p>
              </div>
            ))
          }
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <p className="text-2xl text-amber-500 font-medium mt-20 mb-8">Discover them...</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {
          dummyShowData.slice(0, 4).map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))
        }
      </div>

      <div className="flex justify-center mt-20">
        <button onClick={() => { navigate("/movies"); scrollTo(0, 0) }}
          className="px-10 py-3 text-sm bg-primary hover:bg-pink-700 transition rounded-md
        font-medium cursor-pointer">
          Show more
        </button>
      </div>

    </div>
  ) : (
    <Loading />
  )
}

export default MovieDetails