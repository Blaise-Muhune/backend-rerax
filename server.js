const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const usersRouter = require("./controller/userController");
const itemsRouter = require("./controller/itemsController");
const port = 3000; // Change the port number if needed

const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://127.0.0.1:27017/rerax";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log("error connecting...:", error);
  });

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// app.use(express.json());
app.use("/users", usersRouter);
app.use("/items", itemsRouter);
app.get("/content", (req, res) => {
  res.json({
    statusCode: 200,
    statusMessage: "SUCCESS",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
