import User from "../models/users.js";
import jwt from "jsonwebtoken";
import passport from "passport";

export default {
  add: (req, res) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/signup");
        } else {
          passport.authenticate("local")(req, res, () => {
            res.send(user);
          });
        }
      }
    );
  },
  login: (req, res) => {
    const user = req.body.username;
    const payload = { user };
    const options = { expiresIn: "1d" };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, options);
    res.status(200).send({ user, token });
  },
  getAll: (req, res) => {
    const token = req.decoded;
    if (token && token.user === "admin") {
      User.find({}, (err, users) => {
        if (!err) {
          res.status(200).send(users);
        } else {
          res.status(500).send(err);
        }
      });
    } else {
      res.status(401).send("Authentication error");
    }
  },
};
