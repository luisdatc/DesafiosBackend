import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./path.js";
import path from "path";
import cookieParser from "cookie-parser";

import productosRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carrito.routes.js";
import { productModel } from "./models/products.models.js";
import userRouter from "./routes/users.routes.js";
import sessionRouter from "./routes/session.routes.js";

const app = express();
const PORT = 8080;

const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

//Conexion a la Base de Datos
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Conectada"))
  .catch(() => console.log("Error en conexion a BDD"));

//MIDDLEWARE
app.use(express.json());
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

//verifico si el usuario es administrador o no
/* const auth = (req, res, next) => {
  if (
    req.session.email == "admin@gmail.com" &&
    req.session.password == "1234"
  ) {
    return next(); //continua con la siguiente ejecucion
  }
  return res.send("No tenes acceso a esta ruta");
}; */

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine()); //defino el motor de plantillas a usar y la config
app.set("view engine", "handlebars"); //setting de mi app de handlebars
app.set("views", path.resolve(__dirname, "./views")); //resuelve rutas absolutas a travez de rutas relativas
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.login === true; // Define una variable local en res.locals
  next(); 
});

// Server Socket.io
const io = new Server(serverExpress);

io.on("connection", (socket) => {
  console.log("Servidor Socket.io Conectado");

  socket.on("nuevoProductoRealTime", async (product) => {
    try {
      const newProduct = await productModel.create(product);
      io.emit("productoAgregadoRealTime", newProduct);
    } catch (error) {
      console.error("Error al agregar el producto en tiempo real:", error);
    }
  });

  socket.on("solicitarProductos", async () => {
    try {
      const products = await productModel.find();
      socket.emit("productosMostrados", products);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  });
});

//RUTAS DE LA APP
app.use("/api/users", userRouter);
app.use("/api/products", productosRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);

//RUTAS PARA LAS COOKIES
/* app.get("/setCookie", (req, res) => {
  res
    .cookie("CookieCookie", "Esto es una cookie", {
      maxAge: 100000,
      signed: true, //con solo agregar esto y lo de cookie parser signed se firma la cookie
    })
    .send("Cookie generada");
});

app.get("/getCookie", (req, res) => {
  res.send(req.signedCookies); //trae solo las cookies firmadas
});
 */
//RUTA PARA LAS SESSIONS y login de explicacion en clase
/*
app.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Ingreso ${req.session.counter}`);
  } else {
    req.session.counter = 1;
    res.send("Ingreso por primera vez ");
  }
});

 app.get("/login", (req, res) => {
  const { email, password } = req.body;

  req.session.email = email;
  req.session.password = password;

  res.send("Usuario logeado");
});

app.get("/admin", auth, (req, res) => {
  res.send("Sos Admin");
}); */

// RUTA POARA LA VISTA HOME.HANDLEBARS
app.get("/static", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("home", {
      css: "style.css",
      title: "Home",
      js: "script.js",
      products: products.map((product) => ({
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        code: product.code,
      })),
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/static/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    css: "form.css",
    js: "realTimeProducts.js",
    title: "Agregar Productos",
  });
});

sessionRouter.get("/login", (req, res) => {
  res.render("login", {
    css: "form.css",
    js: "script.js",
    title: "Login",
  });
});

