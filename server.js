const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 5000 || process.env.PORT;
const auth = require("./routes/api/auth");
const teacher = require("./routes/api/teacher");
const slot = require("./routes/api/slots");
const classes = require("./routes/api/class");
const blog = require("./routes/api/blog");
const appointment = require("./routes/api/appointment");

// Body Parsor Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Morgan Middleware
app.use(morgan("dev"));

// Cookie Parser Middleware
app.use(cookieParser());

// Routes Middleware
app.use("/api/auth", auth);
app.use("/api/teacher", teacher);
app.use("/api/slot", slot);
app.use("/api/class", classes);
app.use("/api/blog", blog);
app.use("/api/appointment", appointment);

// Static Middleware
app.use(express.static("public"));

// Listening on Port 5000
app.listen(PORT, (req, res) => {
  console.log(`Server Running on Port: ${PORT}`);
});
