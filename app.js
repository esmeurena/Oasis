const express = require("express");
const app = express();



//middleware
app.use(express.json());


//get
app.get("/",async (req,res,next)=>{
    return res.json("I'm alive")
})



//post





//put





//patch





//delete




//error handling



//port
const port = process.env.PORT || 8000

app.listen(port, ()=> console.log("Tallha's Island and Fabo's Tesla floating toward Harold on port", port))

//terminal start server:
//npm start
//npm run db:reset