import { userModel } from "../models/users.models.js";
import { generateUserError } from "../services/errors/info.js";

export const getUsers = async (req, res) => {
  try {
    const user = await userModel.find();

    if (user) {
      return res.status(200).send(user);
    }
    res.status(404).send(generateUserError({}));
  } catch (error) {
    res.status(500).send({
      error: generateDatabaseError(`Error en consultar el usuario ${error}`),
    });
  }
};

export const getUserbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = await userModel.findById(id);

    if (userId) {
      return res.status(200).send(userId);
    }
    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Usuario no encontrado",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en consultar usuario: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const putUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      first_name,
      last_name,
      age,
      email,
      password,
    });

    if (updatedUser) {
      return res.status(200).send(updatedUser);
    }
    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Usuario no encontrado",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en actualizar el usuario: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (deletedUser) {
      res.status(200).send({ user: deletedUser });
    } else {
      res.status(404).send({
        error: CustomError.createError({
          name: "NotFoundError",
          message: "Usuario no encontrado",
          code: EError.NOT_FOUND_ERROR,
        }),
      });
    }
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en eliminar usuario: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};
