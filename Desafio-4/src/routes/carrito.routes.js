import { Router } from "express";
import CarritoManager from "../class/CarritoManager.js";

const cartsRouter = Router();
const carritoManager = new CarritoManager();

cartsRouter.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await carritoManager.createCart(products);
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const carritoId = req.params.cid;
    const cart = await carritoManager.getCartById(carritoId);

    if (!cart) {
      res.status(404).send("Cart not found");
    } else {
      res.status(200).json(cart.products);
    }
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const carritoId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    await carritoManager.addProductToCart(carritoId, productId, quantity);
    res.status(200).send("Producto agregado al carrito");
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default cartsRouter;
