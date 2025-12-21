import express from "express";

let app = express();
let port = 8080;

app.get("/", (req, res)=>{
    res.send("API Working...");
})

app.listen(8080, ()=>{
    console.log(`server is run port number ${8080}`);
})