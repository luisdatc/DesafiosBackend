import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";
import initializePassport from "./config/passport.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.routes.js";
import nodemailer from "nodemailer";
import { __dirname } from "./path.js";

const whiteList = ["http://127.0.0.1:5173", "http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) != -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Acceso Denegado"));
    }
  },
  credentials: true,
};

const app = express();
const PORT = 8080;

/*let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "correomcoc@gmail.com",
    pass: process.env.PASSWORD_EMAIL,
    authMethod: "LOGIN",
  }  ,
  tls: {
    rejectUnauthorized: false, // Desactiva la verificación del certificado
  }, 
});*/

/* app.get("/mail", async (req, res) => {
  const resultadoEmail = await transporter.sendMail({
    from: "TEST MAIL correomcoc@gmail.com",
    to: "correomcoc@gmail.com",
    subject: "Hola Prueba",
    html: `<p>Hola esto es una prueba</p>`,
  });
  console.log(resultadoEmail);
  res.send("Email enviado");
}); */

//Conexion a la Base de Datos
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Conectada"))
  .catch(() => console.log("Error en conexion a BDD"));

//MIDDLEWARE
app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser(process.env.SIGNED_COOKIE)); //la cookie esta firmada

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true, //estable la conexxion mediante url
        useUnifiedTopology: true, //para conectarse al controlador de la basse de ddatos y manejo de cluster de manera dinamicca
      },
      ttl: 60, //duracion de la sesion en segundos en la base de datos
    }),
    secret: process.env.SESSION_SECRET,
    resave: /* true */ false, //fuerzo a que se intente a guardar a oesar de no tener modificacion en los datos
    saveUninitialized: /* true */ false, //fuerzo a guardar la sesion a pesar de no tener ningun dato
  })
);
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//verifico si el usuario es administrador o no
const auth = (req, res, next) => {
  if (req.session.login === true) {
    next(); // Continuar con la siguiente ejecución
  } else {
    res.redirect("/api/sessions/login");
  }
};

app.set("views", path.resolve(__dirname, "./views")); //resuelve rutas absolutas a travez de rutas relativas
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.login === true; // Define una variable local en res.locals
  next();
});

//Routes
app.use("/", router);

/* PARA VER LO REFERENTE AL FRONT VER EL AFTER DEL FRONTEND Y LA CLASE 15 SEGUNDA PARTE */

const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
