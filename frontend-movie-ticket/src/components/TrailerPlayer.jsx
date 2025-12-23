import YouTube from "react-youtube";

// helper function to extract the videoId from a YouTube URL
function getVideoId(url) {
  try {
    const urlObj = new URL(url); // parse the string into a URL object
    if (urlObj.hostname.includes("youtu.be")) {
      // short link format: https://youtu.be/VIDEOID
      return urlObj.pathname.slice(1); // remove the leading "/"
    }
    // standard format: https://www.youtube.com/watch?v=VIDEOID
    return urlObj.searchParams.get("v"); // grab the "v" query parameter
  } catch {
    return null; // if the URL is invalid, return null
  }
}

const TrailerPlayer = ({ videoUrl }) => {
  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    return <p className="text-red-500">Invalid video URL</p>;
  }

  const opts = {
    width: "860",
    height: "540",
    playerVars: { autoplay: 0 },
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={() => console.log("Player ready")}
      onError={(e) => console.log("Player error:", e)}
      className="rounded-lg border-b-pink-700"
    />
  );
};

export default TrailerPlayer;

/*
- You have trailer URLs like:
https://www.youtube.com/watch?v=uYPbbksJxIg
- The react-youtube component doesn’t accept the full URL.
- It only wants the videoId (the unique code after v= → uYPbbksJxIg).
So we need a helper function to extract that ID from any YouTube link.

getVideoId("https://www.youtube.com/watch?v=uYPbbksJxIg")
hostname = www.youtube.com
searchParams.get("v") = "uYPbbksJxIg"
returns = uYPbbksJxIg
 */