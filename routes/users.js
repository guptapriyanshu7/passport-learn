import passport from "passport";
import controller from "../controllers/users.js";
import validateToken from "../utils.js";

export default (router) => {
  router
    .route("/users")
    .post(controller.add)
    .get(validateToken.validateToken, controller.getAll);
  router.route("/login").post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
    }),
    controller.login
  );
};
