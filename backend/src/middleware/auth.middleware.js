import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import cookieParser from "cookie-parser";



const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {

        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        // const token = req.cookies?.accessToken ||req.headers['Authorization']?.split(" ")[1];
        const token = req.cookies?.accessToken || req.headers['authorization']?.split(" ")[1];

       console.log("Token received in middleware:", token);

        if(!token){
            throw new ApiError(401 , "Unauthorized Request: No access token provided");
        }
        
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET );
           console.log("DecodedToken : ",decodedToken)
        if(!decodedToken?._id){
            throw new ApiError(401,"Invalid access token : Decoded token doesst not contain user ID");
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid access token: User does not exist");
          }


          req.user = user;
        //   req.user = decodedToken;
          next(); // Proceed to the next middleware or controller


    } catch (error) {
        console.error("JWT verification error:", error);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

export default verifyJWT;


// import jwt from "jsonwebtoken";

// const verifyJWT = (req, res, next) => {
//     const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized Request: No access token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach decoded data to req.user
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: "Invalid Token" });
//     }
// };

// export default verifyJWT;
