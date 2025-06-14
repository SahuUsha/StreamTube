import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
import connectDB from "./db/index.js";

dotenv.config({
    path : './.env'
})

const app = express()

// import cors from 'cors';

app.use(cors({

  origin: true, 
  credentials: true,  // Allow cookies (if using cookies for token)
}));

app.use(express.json({limit : "20kb"}))

app.use(express.urlencoded({extended : true , limit : "20kb"}))

app.use(express.static("public"))

app.use(cookieParser())

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error : ",error)
        throw error
    })
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`${`server is running at port :${process.env.PORT}`}`)
    })
})
.catch((err)=>{
    console.log("MONGO db connection error :",err)
})


import userRouter from './routes/user.router.js'
import playlistRouter from './routes/playlist.router.js'
import commentRouter from './routes/comments.router.js'
import tweetRouter from './routes/tweet.router.js'
import likeRouter from './routes/like.router.js'
import healthcheckRouter from './routes/healthcheck.router.js'
import dashboardRouter from './routes/dashboard.router.js'
import subscrberRouter from './routes/subscription.router.js'
import videosRouter from './routes/video.router.js'




app.use("/api/v1/users",userRouter)
app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/comments" , commentRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/dashboard", dashboardRouter )
app.use("/api/v1/subscribe",subscrberRouter)
app.use("/api/v1/videos",videosRouter)


export default app;