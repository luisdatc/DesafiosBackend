import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({ respuesta: "OK", mensaje: users });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consultar usuarios", mensaje: error });
  }
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (user) {
      res.status(200).send({ respuesta: "OK", mensaje: user });
    } else {
      res.status(404).send({
        respuesta: "Error en consultar usuario",
        mensaje: "User not Found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consultar usuario", mensaje: error });
  }
});

userRouter.post("/", async (req, res) => {
  const { first_name, last_name, age, email, password, rol } = req.body;
  try {
    const respuesta = await userModel.create({
      first_name,
      last_name,
      age,
      email,
      password,
      rol,
    });
    res.status(200).send({ respuesta: "OK", mensaje: respuesta });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear usuario", mensaje: error });
  }
});

userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(id, {
      first_name,
      last_name,
      age,
      email,
      password,
    });
    if (user) {
      res.status(200).send({ respuesta: "OK", mensaje: user });
    } else {
      res.status(404).send({
        respuesta: "Error en actualizar usuario",
        mensaje: "User not Found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en actualizar usuario", mensaje: error });
  }
});

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).send({ respuesta: "OK", mensaje: user });
    } else {
      res.status(404).send({
        respuesta: "Error en eliminar usuario",
        mensaje: "User not Found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en eliminar usuario", mensaje: error });
  }
});

userRouter.post("/registro", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  try {
    //verifico si existe el usuario en la base de datos por el correo
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send("El usuario ya existe");
    }

    //modelo para crear el usuario
    const newUser = new userModel({
      first_name,
      last_name,
      age,
      email,
      password,
    });

    // guardo el usuario nuevo en mongodb
    await newUser.save();

    res.redirect("/api/sessions/login");
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default userRouter;
