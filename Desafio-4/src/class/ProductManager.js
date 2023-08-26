import { promises as fs } from "fs";

const path = "./src/productos.json";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.initProductId();
  }

  async initProductId() {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    if (data.length > 0) {
      const lastProduct = data[data.length - 1];
      this.productId = lastProduct.id + 1;
    } else {
      this.productId = 1;
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

    const productCode = product.code;
    const productData = JSON.parse(await fs.readFile(path, "utf-8"));
    const codeExiste = productData.some((p) => p.code === productCode);

    if (codeExiste) {
      console.log("El codigo del producto ya se encuentra agregado");
      return;
    }

    const data = JSON.parse(await fs.readFile(path, "utf-8"));

    const foundProduct = data.find((p) => p.id === product.id);

    if (foundProduct) {
      console.log("El producto ya existe");
    } else {
      const productJson = JSON.stringify(product);
      const parsearProduct = JSON.parse(productJson);

      if (parsearProduct.id === null || parsearProduct.id === undefined) {
        parsearProduct.id = this.productId++;
      }

      data.push(parsearProduct);
      await fs.writeFile(path, JSON.stringify(data));
    }
  }

  async getProducts() {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    /*     console.log(data); */
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

  async addRealTimeProduct(product) {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    data.push(product);
    await fs.writeFile(this.path, JSON.stringify(data));
    return product;
  }
}
