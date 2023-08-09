import express from "express";
import ProductManager from "./Class/ProductManager.js";
import Product from "./Class/Product.js";

const pManager = new ProductManager();

const PORT = 4005;

const app = express();

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

app.get("/products/:pid", async (req, res) => {
  console.log(req.params.pid);

  const allProducts = await pManager.getProducts();
  const filtroProducts = allProducts.find(
    (prod) => prod.id === parseInt(req.params.pid)
  );

  if (filtroProducts) {
    res.send(filtroProducts);
  } else {
    res.send("Producto no existe en Stock");
  }
});

app.get("/products", async (req, res) => {
  const { price, stock, limit } = req.query;

  const allProducts = await pManager.getProducts();

  let filtroVariosProductos = allProducts;

  if (price) {
    filtroVariosProductos = filtroVariosProductos.filter(
      (prod) => parseFloat(prod.price) === parseFloat(price)
    );
  }

  if (stock) {
    filtroVariosProductos = filtroVariosProductos.filter(
      (prod) => parseFloat(prod.stock) === parseInt(stock)
    );
  }

  if (limit && !isNaN(limit) && parseInt(limit) > 0) {
    const limiteProductos = filtroVariosProductos.slice(0, parseInt(limit));
    res.send(limiteProductos);
  } else {
    res.send(filtroVariosProductos);
  }
});

/*const productoNuevo1 = new Product(
  "Ultimate Spiderman",
  "Comic Ultimate Spiderman",
  "5.99",
  "/ruta-imagen1.jpg",
  "USM01",
  "5"
);
const productoNuevo2 = new Product(
  "Anvengers #01",
  "Avengers Assemble",
  "10.99",
  "/ruta-imagen2.jpg",
  "AS001",
  "3"
);
const productoNuevo3 = new Product(
  "X-Men",
  "X-mens",
  "8.99",
  "/ruta-imagen2.jpg",
  "XM001",
  "3"
);
const productoNuevo4 = new Product(
  "Dark Phoenix",
  "Dark Phoenix: Inicios",
  "9.99",
  "/ruta-imagen2.jpg",
  "DP001",
  "3"
); */

/* pManager.addProduct(productoNuevo1); */
/*pManager.addProduct(productoNuevo2);*/
/*pManager.addProduct(productoNuevo3);*/
/*  pManager.addProduct(productoNuevo4);   */

/* // obtener todos los productos
const allProducts = pManager.getProducts();
console.log("Todos los productos:", allProducts); */

/* // buscar producto por id
const productIdToFind = 1; // Reemplaza con el ID del producto que quieras buscar
const foundProduct = pManager.getProductById(productIdToFind);
console.log("Producto encontrado:", foundProduct);*/

/* // actualizar prodcuto
const productIdToUpdate = 2; // Reemplaza con el ID del producto que quieras actualizar
const updatedFields = {
  title: "Avengers",
  price: 11.99,
  stock: 10,
};
const updatedProduct = pManager.updateProduct(productIdToUpdate, updatedFields);
console.log("Producto actualizado:", updatedProduct); */

/* // Eliminar producto
const productIdToDelete = 1; // Reemplaza con el ID del producto que quieras eliminar
const remainingProducts = pManager.deleteProduct(productIdToDelete);
console.log("Productos restantes:", remainingProducts); */

/* app.get("/products", async (req, res) => {
  const allProducts = await pManager.getProducts();
  res.send(allProducts);
}); */

/*app.get("/products", async (req, res) => {
  const { code } = req.query;

  console.log(req.query);

  const allProducts = await pManager.getProducts();
    const filtroProducts = allProducts.filter((prod) => prod.code === code);
  const filtroVariosProductos = allProducts.filter((prod)=> prod.categoria === categoria[0] || prod.categoria === categoria[1])
  res.send(filtroProducts);  //para filtrar por categorias
  res.send(allProducts);
});*/
//query para filtrar datos
//params para consultar por id
