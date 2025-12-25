import { dummyShowData } from "../assets/dummyShowCard.js"
import BlurCircle from "../components/BlurCircle.jsx"
import MovieCard from "../components/MovieCard.jsx"

const Movies = () => {
  return dummyShowData.length > 0 ? (
    <div className="relative my-32 mb-30 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">

      <BlurCircle top="60px" left="40px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-2xl text-amber-500 font-medium my-4">Check them...</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {
          dummyShowData.map((movie) => {
            return <MovieCard movie={movie} key={movie._id} />
          })
        }
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center text-red-600">No movies avaliable!</h1>
    </div>
  )

}

export default Movies