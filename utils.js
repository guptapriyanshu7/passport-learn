import jwt from "jsonwebtoken";

export default {
  validateToken: (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (authorizationHeader) {
      const token = req.headers.authorization.split(" ")[1];
      const options = { expiresIn: "1d" };
      try {
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decoded = result;
        next();
      } catch (err) {
        res.status(403).send("Authentication error. Access Denied.");
      }
    } else {
      res.status(401).send("Authentication error. Token required.");
    }
  },
};
