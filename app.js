const express = require('express');
const userRoute = require('./routes/user.routes')
const pageRoute = require('./routes/page.routes');
const dotenv = require('dotenv');
const connectToDatabase = require("./config/db");
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
connectToDatabase()

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/",pageRoute)
app.use("/user",userRoute)
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})