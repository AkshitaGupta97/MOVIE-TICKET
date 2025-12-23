import { useState } from "react";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";
import dummyTrailer from "../assets/dummyTrailer";
import TrailerPlayer from "./TrailerPlayer";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailer[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-amber-300 font-medium text-3xl  mx-auto">
        Trailers
      </p>

      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        <BlurCircle top="-100px" left="-100px" />
        <TrailerPlayer videoUrl={currentTrailer.videoUrl} />
      </div>

      <div className="group grid grid-cols-5 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailer.map((trailer) => (
          <div
            key={trailer.id}
            onClick={() => setCurrentTrailer(trailer)}
            className="relative opacity-100 group-hover:opacity-50 hover:opacity-100 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer"
          >
            <img
              src={trailer.image}
              alt={trailer.title}
              className="rounded-lg w-full h-full object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;

/*
<ReactPlayer
          key={currentTrailer.id}   // important!
          url='https://www.youtube.com/watch?v=uYPbbksJxIg'
          controls={true}
          playing={false}   // autoplay
          muted={false}     // required for autoplay
          onReady={() => console.log("Player ready")}
          onPlay={() => console.log("Video started")}
          onError={(e) => console.log("Player error:", e)}

          width="860px"
          height="540px"
        />
 */