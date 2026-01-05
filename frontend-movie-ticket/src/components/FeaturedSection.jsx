import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from "../context/AppContext";
//import { dummyShowData } from "../assets/dummyShowCard";

function FeaturedSection() {
  const navigate = useNavigate();
  const {shows} = useAppContext();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">

      <div className="relative">
        <BlurCircle top='0px' right='80px'/>
        <BlurCircle top='0px' left='20px'/>
        <div className="flex items-center justify-between w-full px-6 md:px-16 lg:px-24 xl-px-44 overflow-hidden">
          <p className="text-amber-300  font-medium text-2xl">Trendy Movies</p>
          <button onClick={() => navigate('/movies')}
            className="group flex items-center gap-2 text-md text-gray-300 cursor-pointer border-1 px-1 py-1.5 rounded-full">
            Watch All
            <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
        {
          shows.slice(0,3).map((show) => (
            <MovieCard key={show._id} movie={show.movie} />
          ))
        }
      </div>

      <div className="flex justify-center mt-20">
        <button onClick={() => {navigate("/movies"); scrollTo(0,0)}}
        className="px-10 py-3 text-sm bg-pink-700 hover:bg-pink-800 transition rounded-md 
        font-medium cursor-pointer">Show more</button>
      </div>

    </div>
  )
}

export default FeaturedSection