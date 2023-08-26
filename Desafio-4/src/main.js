import express from "express";
import productosRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carrito.routes.js";
import { __dirname } from "./path.js";
import path from "path";
import multer from "multer";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./class/ProductManager.js";

const PORT = 8080;

const app = express();

//configuracion de multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine()); //defino el motor de plantillas a usar y la config
app.set("view engine", "handlebars"); //setting de mi app de handlebars
app.set("views", path.resolve(__dirname, "./views")); //rresuelve rutas absolutas a travez de rutas relativas

//configuracion para multer
/* const upload = multer({ storage: storage }); */

app.use("/static", express.static(path.join(__dirname, "/public")));

// Server Socket.io

const io = new Server(serverExpress);

io.on("connection", (socket) => {
  console.log("Servidor Socket.io Conectado");

  socket.on("nuevoProductoRealTime", (product) => {
    productManager
      .addRealTimeProduct(product)
      .then((newProduct) => {
        io.emit("productoAgregadoRealTime", newProduct);
      })
      .catch((error) => {
        console.error("Error al agregar el producto en tiempo real:", error);
      });
  });
});

//Rutas
app.use("/api/products", productosRouter);
app.use("/api/carts", cartsRouter);

//carga de imagen con multer
/* app.post("/upload", upload.single("mystique"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.status(200).send("Imagen cargada");
}); */

const productsPath = "./src/productos.json";
const productManager = new ProductManager(productsPath);

// Ruta para la vista home.handlebars
app.get("/static", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {
    css: "style.css",
    title: "Home",
    js: "script.js",
    products: products, // Pasa los productos a la vista
  });
});

app.get("/static/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    css: "form.css",
    js: "realTimeProducts.js",
    title: "Productos",
  });
});
