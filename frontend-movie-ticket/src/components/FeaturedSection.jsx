import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"


function FeaturedSection() {
    const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">

        <div className="flex items-center justify-between  px-6 md:px-16 lg:px-24 xl-px-44 overflow-hidden">
            <p className="text-gray-300 font-medium text-lg">Trendy Movies</p>
            <button onClick={() => navigate('/movies')}
             className="group flex items-center gap-2 text-md text-gray-300">
                Watch All 
                <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
            </button>
        </div>

        <div></div>

        <div></div>

    </div>
  )
}

export default FeaturedSection