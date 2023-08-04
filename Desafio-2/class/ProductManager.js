import { promises as fs } from "fs";

const path = "./productos.json";

export default class ProductManager {
  constructor() {
    this.productId = 0;
    this.path = "./productos.json";
  }

  async addProduct(product) {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    product.id = this.productId++;
    const foundProduct = data.find((p) => p.id === product.id);

    if (foundProduct) {
      console.log("El producto ya existe");
    } else {
      data.push(product);
      await fs.writeFile(path, JSON.stringify(data), "utf-8");
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
      return null;
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
