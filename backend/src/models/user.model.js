import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt" 

const userSchema = new Schema({
    username:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim : true,
        index : true  // it make easy for searching
      },
      email:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim : true,
       
      },
      fullname:{
        type: String,
        required : true,
        trim : true,
        index : true
       
      },
      avatar:{
        type: String, // cloudinary url
        required : true,
      },
      password:{
        type: String, // cloudinary url
        required : true
       
      },
      coverImage:{
        type: String, // cloudinary url
      },
      watchHistory:[{
        type: Schema.Types.ObjectId,
        ref :"Video"
      }],
      
      refreshToken:{   
        type : String,
      }
   },
   {
    timestamps : true
   }

)

userSchema.pre("save",async function (next) {

    if(!this.isModified("password"))  return next();
    
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    console.log("Plain password:", password); // should log the plain-text password from the user input
  console.log("Hashed password:", this.password);
 
  return await bcrypt.compare(password, this.password )

}

function generateToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  userSchema.methods.generateAccessToken=function(){
    const payload={
        _id: this._id,  // User ID
        email: this.email,
        username: this.username,
        fullname: this.fullname
    }

    const token = generateToken(payload,process.env.ACCESS_TOKEN_SECRET, '1d')

    if (!token) {
        throw new ApiError(404, "Token is not generating");
      }
    
      return token;
  }

  userSchema.methods.generateRefreshToken = function () {
    // Payload for the refresh token
    const payload = {
      _id: this._id,  // User ID
    };
  
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '10d'  // Set expiration for refresh token
    });
  
    if (!token) {
      throw new ApiError(404, "Token is not generating");
    }
  
    return token;
  };
  
  export const User = mongoose.model("User" , userSchema)