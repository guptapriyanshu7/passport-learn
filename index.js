import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import config from "./config.js";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import passport from "passport";
import User from "./models/users.js";
import session from "express-session";
// import logger from "morgan";

const app = express();

app.use(
  session({
    secret:
      "Everyone of our deeds is merely a response to some previous, unsettled deed",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/css", express.static("css"));

const router = express.Router();
const uri = process.env.MONGO_CONN_URI;
const environment = process.env.NODE_ENV || "development";
const stage = config[environment];
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected:", uri);
  })
  .catch((err) => {
    console.error("connection error:", err);
  });

app.use("/api/v1", routes(router));

if (environment !== "production") {
  app.use(logger("dev"));
}

app.use("/api/v1", (req, res, next) => {
  res.send("Hello");
  next();
});

app.listen(stage.port, () => {
  console.log("Server online..." + stage.port);
});

app.use(function (req, res, next) {
  res.locals.currUser = req.user;
  next();
});
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/admin", isLoggedIn, (req, res) => {
  res.render("admin");
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

export default app;
