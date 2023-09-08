const express = require("express");
const { default: mongoose } = require("mongoose");
const { config } = require("dotenv");
config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => {
    console.log(e.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", require("./routes/users"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Running on ${port} port..`);
});
