import { Router } from "express";
import { userModel } from "../models/users.models.js";

const sessionRouter = Router();

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (req.session.login) {
      res.redirect("/static");
      return;
    }

    const user = await userModel.findOne({ email: email });

    if (user) {
      if (user.password == password) {
        req.session.login = true;
        req.session.email = email;
        res.redirect("/static");
      } else {
        req.session.error = "Credenciales Inválidas";
        console.log("Credenciales Inválidas");
        res.redirect("/api/sessions/login");
      }
    } else {
      req.session.error = "Credenciales Inválidas";
      console.log("Credenciales Inválidas");
      res.redirect("/api/sessions/login");
    }
  } catch (error) {
    console.error("Error en login:", error);
    req.session.error = "Credenciales Inválidas";
    res.redirect("/api/sessions/login");
  }
});

sessionRouter.post("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy((error) => {
      if (error) {
        console.log("error al destruir la sesion:", error);
      }
      res.render("logout", {
        css: "form.css",
        js: "script.js",
        title: "Logout",
      });
    });
  } else {
    res.redirect("/api/sessions/login");
  }
});

export default sessionRouter;
