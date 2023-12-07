import Router from "express";
import * as usersController from "../controllers/users.controllers";

const resetPasswordRouter = Router();

resetPasswordRouter.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await usersController.getUserByEmail(email);

    if (user) {
      user.generatePasswordReset(); // Genera el token y la fecha de expiración
      await user.save();
      await usersController.sendPasswordResetEmail(
        user.email,
        user.resetPasswordToken
      );
      res
        .status(200)
        .json({ message: "Correo de restablecimiento enviado con éxito" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});
