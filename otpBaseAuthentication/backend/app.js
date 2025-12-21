import express from "express";
import 'dotenv/config';
import authRoute from './routes/auth.js';


import connectDB from "./utils/mongodb.js";

const app = express();
const port = 8080;


connectDB();
app.use(express.json());

app.use('/api/auth', authRoute);

app.get("/", (req, res) =>{
    res.send("Api is working...");
})

app.listen(port, ()=>{
    console.log(`server is listing port no ${port}`);
})