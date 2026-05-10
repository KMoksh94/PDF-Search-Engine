const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const PORT = process.env.PORT || 3000; 
dotenv.config();
const connectionDB = require("./database/connectionDB");
const { startCleanupRoutine } = require("./utilities/cleanup");
const app = express()
connectionDB();

startCleanupRoutine();

app.use(express.json())
app.use(cors());
app.use("/pdf",require("./routes/pdf"))
app.listen(PORT,()=>{console.log(`Server is running at ${PORT}`)})