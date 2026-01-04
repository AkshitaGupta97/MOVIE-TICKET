// go to tmdb [the movie database] website and create account {password: tmdb7890}
// login and get TMDB_API_KEY
// and go to MORE -> API DOCUMENTATION -> API REFERENCE ->  find the MOVIE LIST-> NOW PLAYING copy api
// after this MOVIES -> Details  , go to credits

import axios from "axios"
import Movie from "../modals/Movie.js";
import Show from "../modals/Show.js";

// helper to build axios config for TMDB depending on key type (v4 bearer vs v3 api_key)
const getTmdbConfig = () => {
    const key = process.env.TMDB_API_KEY || "";
    if (!key) return null;
    // TMDB v4 tokens are JWT-like and often start with 'eyJ'
    if (key.startsWith('eyJ')) return { headers: { Authorization: `Bearer ${key}` } }; // - If the key looks like a JWT (starts with eyJ), treat it as TMDB v4 and send a Bearer header.
    // fallback to v3 api key as query param
    return { params: { api_key: key } }; // - Otherwise, treat it as a v3 key and pass it as the api_key query parameter.
}

// Api to get now playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
    try {
        // build auth config
        const tmdbConfig = getTmdbConfig();
        if (!tmdbConfig) return res.status(500).json({ success: false, message: "TMDB_API_KEY not configured" });
        // Extracts the JSON response body from TMDB.
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', tmdbConfig)
        const movies = data.results;  // - TMDB returns a JSON object with a results array → contains movie objects. This line stores that array in movies.
        res.json({ success: true, movies: movies });
    }
    catch (error) {
        console.log("error from showController -> ", error);
        res.json({ success: false, message: error.message });
    }
}

// Api to add a new show to database
export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body; //- Expects movieId (TMDB ID), showsInput (dates and times), and showPrice.
        if (!movieId) return res.status(400).json({ success: false, message: "movieId is required" });
        if (!Array.isArray(showsInput) || showsInput.length === 0) return res.status(400).json({ success: false, message: "showsInput must be a non-empty array" });

        const movieIdStr = String(movieId);
        let movie = await Movie.findById(movieIdStr); //- Tries Movie.findById(movieId) to see if it already exists.
        if (!movie) {  // Checks if the movie already exists in your MongoDB database.
            // fetch movie details from TMDB
            const tmdbConfig = getTmdbConfig();
            if (!tmdbConfig) return res.status(500).json({ success: false, message: "TMDB_API_KEY not configured" });
            const [movieDetailsResponse, movieCreditResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, tmdbConfig),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, tmdbConfig)
            ]);
            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditResponse.data;

            const movieDetails = {
                _id: movieIdStr,
                title: movieApiData.title || "",
                overview: movieApiData.overview || "",
                poster_path: movieApiData.poster_path || "",
                backdrop_path: movieApiData.backdrop_path || "",
                genres: Array.isArray(movieApiData.genres) ? movieApiData.genres : [],
                casts: Array.isArray(movieCreditsData.cast) ? movieCreditsData.cast : [],
                release_date: movieApiData.release_date || "",
                original_language: movieApiData.original_language || "",
                tagline: movieApiData.tagline || "",
                vote_average: typeof movieApiData.vote_average === 'number' ? movieApiData.vote_average : 0,
                runtime: typeof movieApiData.runtime === 'number' ? movieApiData.runtime : 0,
            }
            // Add movie to database
            movie = await Movie.create(movieDetails);
        }
        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            if (!showDate) return; // skip invalid entries
            if (!Array.isArray(show.time)) return;
            show.time.forEach((time) => {
                if (!time) return;
                // Try common ISO formats, fall back to adding seconds
                let dateTimeString = `${showDate}T${time}`; // - Builds a datetime string by combining the date and time with a T (ISO 8601 format). Example: "2026-01-05T14:00"
                let dt = new Date(dateTimeString); // try parsing
                if (isNaN(dt.getTime())) { // if invalid, try adding seconds
                    dateTimeString = `${showDate}T${time}:00`;
                    dt = new Date(dateTimeString);
                }
                if (isNaN(dt.getTime())) return; // skip invalid date/time
                showsToCreate.push({
                    movie: movieIdStr,
                    showDateTime: dt,
                    showPrice: String(showPrice || ""),
                    occupiedSeats: {}
                })
            })
        });
        if(showsToCreate.length > 0) {
            const inserted = await Show.insertMany(showsToCreate);
            return res.json({success:true, message:"Show Added successfully", inserted: inserted.length});
        }
        res.status(400).json({ success: false, message: "No valid shows to insert" });

    } catch (error) {
        console.log("Error fron show Controller -> ", error);
        res.send({ success: false, message: error.message });
    }
}

// Api to get all shows from database
export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1});
        // Return the full show documents (with populated `movie`) so frontend can read `show.movie.title`,
        // `show.showDateTime`, `show.showPrice`, and `show.occupiedSeats`.
        res.json({success: true, shows});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Api to get single show from database
export const getSingleShow = async (req, res) => {
    try {
        const {movieId} = req.params; // - Expects a movie ID as a URL parameter. - if the route is /shows/123, then movieId = "123".
        const show =  await Show.find({movie: movieId, showDateTime: {$gte: new Date()}}); // - Finds all shows where the movie field matches the given movieId. Also ensures showDateTime >= now (only upcoming shows).
        const movie = await Movie.findById(movieId);
        const dateTime = {};
        show.forEach((show) => {
            const date = show.showDateTime.toISOString().split('T')[0]; // - Extracts just the date part (YYYY-MM-DD) from the ISO string.
            const time = show.showDateTime.toISOString().split('T')[1].substring(0,5); // - Extracts the time part (HH:MM) from the ISO string.
            if(!dateTime[date]){
                dateTime[date] = [];
            }
            dateTime[date].push({ time: time, showId: show._id});
        });
        res.json({success: true, show: show, movie: movie, dateTime: dateTime});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

/*
- In Mongoose (MongoDB ODM for Node.js), .populate() is used to replace a referenced field (usually an ObjectId) with the actual document it refers to.
- It’s like saying: “Instead of just giving me the ID of the related document, go fetch the full document and insert it here.”

- .populate('movie') replaces that ID with the actual movie document.
- Example:
- Without populate: movie: ObjectId("64f1a2b...")
- With populate: movie: { _id: "64f1a2b...", title: "Inception", genre: "Sci-Fi" }
- Purpose: So you don’t just get IDs, you get full movie details attached to each show.

- Promise.all([...])
- Runs multiple asynchronous operations in parallel.
- It takes an array of promises and waits until all of them are resolved (or rejects if any one fails).
- This is more efficient than awaiting each request sequentially, because both 
API calls happen at the same time.

- Each call sends an HTTP GET request to TMDB’s API.
- The first request:
https://api.themoviedb.org/3/movie/${movieId} → fetches the movie details (title, overview, poster, runtime, etc.).
- The second request:
https://api.themoviedb.org/3/movie/${movieId}/credits → fetches the credits (cast and crew list).
- headers: { Authorization: \Bearer ${process.env.TMDB_API_KEY}` }`
- Adds an authorization header to authenticate with TMDB.

- Array.isArray(showsInput)
- This checks whether the variable showsInput is actually an array.
- It returns true if showsInput is an array, otherwise false.
- isNaN(dt.getTime())
- This checks if the date object dt represents a valid date.
- getTime() returns the time in milliseconds since January 1, 1970.
- If dt is invalid, getTime() returns NaN (Not-a-Number), and isNaN() will return true.

- const [movieDetailsResponse, movieCreditResponse] assigns:
- movieDetailsResponse → the axios response object from the first request.
- movieCreditResponse → the axios response object from the second request.

- new Set(...): Wraps that array in a Set, which automatically removes duplicates (so you only get unique movies, even if multiple shows exist for the same movie).
- Result: uniqueShows contains only distinct movies that have upcoming shows
 */
