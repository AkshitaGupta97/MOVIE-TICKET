import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

function HeroSection() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36
       bg-cover bg-center h-screen text-white bg-[url('https://www.shutterstock.com/image-vector/festive-design-cinema-film-strip-600nw-1464459368.jpg')]"
    >
      <h1 className="text-4xl font-bold ">Whispers in the Static</h1>

      <div className="flex items-center gap-4 text-pink-200">
        <span>Action | Adventure | Thrilled</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className='w-4.5 h-4.5' /> 2025
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className='w-4.5 h-4.5' /> 2h 8m
        </div>
      </div>
      <p className="max-w-md text-gray-400">
        "❤️In your eyes, I found forever, A tender line for a love story where destiny feels inevitable. Two souls, one heartbeat."
        ⚡Fear whispers, but courage screams. Ideal for a suspenseful thriller where bravery is tested, The closer you look, the darker it gets.
        A chilling line for a mystery or psychological thriller".
      </p>
      <button onClick={() => navigate("/movies")}
       className="flex items-center gap-1 px-6 py-3 text-md bg-pink-700 hover:bg-pink-800
        transition rounded-2xl font-medium cursor-pointer
      ">
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  )
}

export default HeroSection

