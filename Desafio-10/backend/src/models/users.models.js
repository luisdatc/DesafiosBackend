import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { cartModel } from "./cart.models.js";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
    index: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    default: "user",
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
});

/* userSchema.plugin(mongoosePaginate); */

userSchema.pre("save", async function (next) {
  try {
    const newCarrito = await cartModel.create({});
    this.cart = newCarrito._id;
  } catch (error) {
    next(error);
  }
});

export const userModel = model("users", userSchema);
