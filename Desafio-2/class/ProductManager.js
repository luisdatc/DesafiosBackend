import { promises as fs } from "fs";

const path = "./productos.json";

export default class ProductManager {
  constructor() {
    this.initProductId();
  }

  async initProductId() {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    if (data.length > 0) {
      const lastProduct = data[data.length - 1];
      this.productId = lastProduct.id + 1;
    } else {
      this.productId = 1; // In case there are no products yet
    }
  }

  async addProduct(product) {
    //valido que los campos no esten vacios
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock === ""
    ) {
      console.log("Error: Los campos no deben estar vacios!!");
      return;
    }

    const data = JSON.parse(await fs.readFile(path, "utf-8"));

    const foundProduct = data.find((p) => p.id === product.id);

    if (foundProduct) {
      console.log("El producto ya existe");
    } else {
      const productJson = JSON.stringify(product);
      const parsearProduct = JSON.parse(productJson);

      // If the product's ID is null or undefined, assign a new ID
      if (parsearProduct.id === null || parsearProduct.id === undefined) {
        parsearProduct.id = this.productId++;
      }

      data.push(parsearProduct);
      await fs.writeFile(path, JSON.stringify(data));
    }
  }

  async getProducts() {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    console.log(data);
    return data;
  }

  async getProductById(productId) {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    const foundProduct = data.find((product) => product.id === productId);

    if (!foundProduct) {
      console.log("Error: Product Not Found");
      return null;
    }

    console.log(foundProduct);
    return foundProduct;
  }

  async updateProduct(productId, updatedFields) {
    

    const prods = JSON.parse(await fs.readFile(path, "utf-8"));
    const indice = prods.findIndex((prod) => prod.id === productId);

    if (indice !== -1) {
      const updatedProduct = { ...prods[indice], ...updatedFields };
      prods[indice] = updatedProduct;
      await fs.writeFile(path, JSON.stringify(prods));
      return updatedProduct; 
    } else {
      console.log("Producto no encontrado");
       return null
    }
  }

  async deleteProduct(productId) {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    const filteredProducts = data.filter((product) => product.id !== productId);

    if (data.length === filteredProducts.length) {
      console.log("Error: Product Not Found");
      return null;
    }

    await fs.writeFile(path, JSON.stringify(filteredProducts));
    return filteredProducts;
  }
}
