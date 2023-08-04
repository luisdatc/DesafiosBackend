import Product from "./class/Product.js";
import ProductManager from "./class/ProductManager.js";

const pManager = new ProductManager();

const productoNuevo1 = new Product(
  "Ultimate Spiderman",
  "Comic Ultimate Spiderman",
  5.99,
  "/ruta-imagen1.jpg",
  "USM01",
  5
);
const productoNuevo2 = new Product(
  "Anvengers #01",
  "Avengers Assemble",
  10.99,
  "/ruta-imagen2.jpg",
  "AS001",
  3
);
/* const productoNuevo3 = new Product(
  "X-Men",
  "X-mens",
  8.99,
  "/ruta-imagen2.jpg",
  "XM001",
  3
);
const productoNuevo4 = new Product(
  "Dark Phoenix",
  "Dark Phoenix: Inicios",
  9.99,
  "/ruta-imagen2.jpg",
  "DP001",
  3
); */

pManager.addProduct(productoNuevo1);
pManager.addProduct(productoNuevo2);
/* pManager.addProduct(productoNuevo3);
pManager.addProduct(productoNuevo4); */

// obtener todos los productos
const allProducts = pManager.getProducts();
console.log("Todos los productos:", allProducts);

// buscar producto por id
const productIdToFind = 1; // Reemplaza con el ID del producto que quieras buscar
const foundProduct = pManager.getProductById(productIdToFind);
console.log("Producto encontrado:", foundProduct);

// actualizar prodcuto
const productIdToUpdate = 2; // Reemplaza con el ID del producto que quieras actualizar
const updatedFields = {
  title: "Avengers",
  price: 11.99,
  stock: 10,
};
const updatedProduct = pManager.updateProduct(productIdToUpdate, updatedFields);
console.log("Producto actualizado:", updatedProduct);

// Eliminar producto
const productIdToDelete = 1; // Reemplaza con el ID del producto que quieras eliminar
const remainingProducts = pManager.deleteProduct(productIdToDelete);
console.log("Productos restantes:", remainingProducts);
