import { Router } from "express";
import cartsRouter from "./carrito.routes.js";
import productosRouter from "./products.routes.js";
import sessionRouter from "./session.routes.js";
import userRouter from "./users.routes.js";

const router = Router();

//Rutas de la app
router.use("/api/users", userRouter);
router.use("/api/products", productosRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/sessions", sessionRouter);

export default router;
