const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

const dbUser ='anyVision';
const dbPass = 'any123454321';
const dbRoute = `mongodb://${dbUser}:${dbPass}@ds261128.mlab.com:61128/any-vision`;

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/getTopQueries", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  }).sort({$natural:-1}).limit(10);
});

router.post("/putQuery", (req, res) => {
  let data = new Data();

  const { id, query } = req.body;

  if ((!id && id !== 0) || !query) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.query = query;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));