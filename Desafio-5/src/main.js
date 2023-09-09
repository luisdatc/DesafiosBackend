import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./path.js";
import path from "path";

import userRouter from "./routes/users.routes.js";
import productosRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carrito.routes.js";
import messageRouter from "./routes/messages.routes.js";
import { productModel } from "./models/products.models.js";

const app = express();
const PORT = 8080;

const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

//Conexion a la Base de Datos
mongoose
  .connect(
    "mongodb+srv://luisct91:21210ldtc@cluster0.kvfp5k9.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Conectada"))
  .catch(() => console.log("Error en conexion a BDD"));

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine()); //defino el motor de plantillas a usar y la config
app.set("view engine", "handlebars"); //setting de mi app de handlebars
app.set("views", path.resolve(__dirname, "./views")); //rresuelve rutas absolutas a travez de rutas relativas
app.use("/static", express.static(path.join(__dirname, "/public")));

// Server Socket.io

const io = new Server(serverExpress);

io.on("connection", (socket) => {
  console.log("Servidor Socket.io Conectado");

  socket.on("add-message", async ({ email, mensaje }) => {
    console.log(mensaje);
    await messageModel.create({ email: email, message: mensaje });
    const messages = await messageModel.find();
    socket.emit("show-messages", messages);
  });

  socket.on("display-inicial", async () => {
    const messages = await messageModel.find();
    socket.emit("show-messages", messages);
  });

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

//RUTAS
app.use("/api/users", userRouter);
app.use("/api/products", productosRouter);
app.use("/api/carts", cartsRouter);
app.use("api/messages", messageRouter);

// Ruta para la vista home.handlebars
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
    title: "Productos",
  });
});
