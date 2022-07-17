var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { client } = require("./configs/database");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// middle ware
const { ErrorMessage } = require("./middlewares/error-handler");
var app = express();

// Connect data base postgreSQL
client.connect().then(() => console.log("connect database complete."));

app.use(cors()); // cors
app.use(limiter); // rate limit
app.use(helmet()); // helmet seculity
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

app.use("/", require("./routes/auth-routing"));

app.use(ErrorMessage);

module.exports = app;
