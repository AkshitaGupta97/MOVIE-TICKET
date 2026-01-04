import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
//- Clerk: useUser gives the current user; useAuth gives methods like getToken() for authenticated requests.

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL; // Set the base URL for all axios requests using an environment variable.

export const AppContext = createContext(); //  creates a new Context object.

export const AppProvider = ({children}) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favouriteMovie, setFavouriteMovie] = useState([]);

    const {user} = useUser();
    const {getToken} = useAuth();  //  Asynchronously returns a JWT to authorize API calls.
    const location = useLocation();  // The current route path; used to check if the user is on an admin page.
    const navigate = useNavigate(); 

    // fetch admin function
    const fetchIsAdmin = async(req, res) => {
        try {
            const {data} = await axios.get('/api/admin/is-admin', {
                headers: {Authorization: `Bearer ${await getToken()}`}
            });
            setIsAdmin(data.isAdmin);
            if(!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('Access Denied. Admins Only');
            }
        } catch (error) {
            console.error(error)
        }
    }

    // fetch show
    const fetchShows = async() => {
        try {
            const {data} = await axios.get('/api/show/all');
            if(data.success){
                setShows(data.shows);
            }
            else {
                toast.error(data.message);
            }
        } 
        catch (error) {
            console.error(error);
        }
    }

    // fetch favourite movie
    const fetchFavouriteMovies = async() => {
        try {
            const {data} = await axios.get('/api/user/favourite', {
                headers: {Authorization: `Bearer ${await getToken()}`}
            });
            if(data.success){
                setFavouriteMovie(data.movies);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchShows();
    }, [])

    useEffect(() => {
        if(user){
            fetchIsAdmin();
            fetchFavouriteMovies();
        }
    }, [user])

    const value = {
        axios, fetchIsAdmin, user, getToken, navigate, isAdmin, shows, 
        favouriteMovie, fetchFavouriteMovies, 
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext); // - useContext → allows components to consume (read) values from that Context.


/*
- AppProvider is a wrapper component.
- It uses AppContext.Provider to make value available to all child components.
- children means whatever components you wrap inside <AppProvider> ... </AppProvider> will get access to this context.
- Right now, value is just an empty object {}, but in a real app you’d put useful state/data here (like user info, theme, settings, etc.).

- This is a convenience function.
- Instead of writing useContext(AppContext) everywhere, you can just call useAppContext().
- It returns whatever value you passed into the provider.

Bearer <token>
- where <token> comes from await getToken() (Clerk provides this function).
👉 This tells your backend who the user is and proves they are authenticated. Without this header, the backend would reject the request or treat it as unauthenticated.


*/