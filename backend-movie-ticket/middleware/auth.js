import {clerkClient} from "@clerk/express";
//- Imports the Clerk SDK for Express.
//- clerkClient is the object that lets you interact with Clerk’s API (e.g., fetching user details).

export const protectAdmin = async(req, res, next) => {
    try {
        const {userId} = req.auth; // provides the currently logged-in user's ID.
        if(!userId){
            return res.json({success: false, message: "Unauthorized! Please log in."});
        }
        const user = await clerkClient.users.getUser(userId); //- Uses clerkClient to fetch user details based on userId.
        if(user.privateMetadata?.role !== 'admin'){  // - Checks if the user's privateMetadata has a role property set to 'admin'.
            return res.json({success: false, message: "Unauthorized! Admins only."});
        }
        next();
    } catch (error) {
        console.log("Error in protectAdmin middleware -> ", error);
        res.json({success: false, message: "Internal Server Error"});
    }
}

/*
const {userId} = req.auth;
- Extracts the userId from req.auth.
- Clerk attaches authentication info to req.auth after a user logs in.
- This gives you the currently logged-in user’s ID.

✅ In summary:
This middleware checks if the logged-in user has the role "admin". If not, it blocks them with an "Unauthorized" message.
If yes, it lets them proceed. If something fails (like Clerk API issues), it returns an "Internal Server Error."
*/