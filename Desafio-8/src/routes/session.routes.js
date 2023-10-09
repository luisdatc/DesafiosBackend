import { Router } from "express";
import { userModel } from "../models/users.models.js";
import passport from "passport";
import { passportError, authorization } from "../utils/messageError.js";
import { generateToken } from "../utils/jwt.js";

const sessionRouter = Router();

sessionRouter.post(
  "/login",
  passport.authenticate("login"),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send({ mensaje: "Usuario invalido" });
      }

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
      };

      const token = generateToken(req.user);

      res.cookie("jwtCookie", token, {
        maxAge: 43200000, //12horas en ms
      });

      res.status(200).send({ payload: req.user });
    } catch (error) {
      res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
    }
  }
);

sessionRouter.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(400).send({ mensaje: "Usuario ya existente" });
      }

      res.status(200).send({ mensaje: "Usuario registrado" });
    } catch (error) {
      res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
    }
  }
);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {
    res.status(200).send({ mensaje: "Usuario registrado" });
  }
);

sessionRouter.get(
  "/githubCallback",
  passport.authenticate("github"),
  async (req, res) => {
    req.session.user = req.user;
    res.status(200).send({ mensaje: "Usuario logueado" });
  }
);

sessionRouter.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.clearCookie("jwtCookie");
  res.status(200).send({ resultado: "Usuario deslogueado" });
  /*   res.redirect("/api/sessions/login"); */
  /*     res.render("logout", {
      css: "form.css",
      js: "script.js",
      title: "Logout",
    }); */
});
//verifica que el token enviado sea valido (misma contraseña)
sessionRouter.get(
  "/testJWT",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    res.send(req.user);
  }
);
sessionRouter.get(
  "/current",
  passportError("jwt"),
  authorization(
    "user"
  ) /* aca puedo cambiar el user por admin si quiero que la ruta sea solo para administradores */,
  (req, res) => {
    res.send(req.user);
  }
);

export default sessionRouter;

//quede en la clase 12 03:52:23
