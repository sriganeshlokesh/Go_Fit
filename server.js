const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = 5000 || process.env.PORT;

// Connect to Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello From Server");
});

// Listening on Port 5000
app.listen(PORT, (req, res) => {
  console.log(`Server Running on Port: ${PORT}`);
});
