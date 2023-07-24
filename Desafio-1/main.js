class ProductManager {
  constructor() {
    this.products = [];
    this.productId = 1;
  }

  //Metodo agregar prodcuto
  addProduct(product) {

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


    //valido que el campo code no este ya ingresado
    const productCode = product.code;
    for (const p of this.products) {
      if (p.code === productCode) {
        console.log(
          "Error: El codigo del producto ya se encuentra asignado a un producto"
        );
      }
    }

    //incremento el id del producto
    product.id = this.productId++;
    this.products.push(product);
    console.log("Producto agregado:", product);
  }

  //retorno los productos agregados
  getProducts() {
    return this.products;
  }

  //retorno el producto por id
  getProductById(productId) {
    const foundProduct = this.products.find(
      (product) => product.id === productId
    );
    if (!foundProduct) {
      console.log("Error: Product Not Found");
      return "Producto No Encontrado";
    }
    return foundProduct;
  }
}

const productManager = new ProductManager();

productManager.addProduct({
  code: "546341",
  title: "Ultimate Spiderman",
  price: 3.5,
  description: "Comic de Spiderman",
  thumbnail: "ruta/CSpidermanU.jpg",
  stock: 10,
});

productManager.addProduct({
  code: "24543541",
  title: "Avengers Assemble",
  price: 5.5,
  description: "Comic inicial de los Avengers",
  thumbnail: "ruta/CAVengersA.jpg",
  stock: 5,
});

productManager.addProduct({
  code: "24543",
  title: "Ant-Man #1",
  price: 4.5,
  description: "Comic Ant-man",
  thumbnail: "ruta/CAntA.jpg",
  stock: 6,
});

const productos = productManager.getProducts();
console.log("Todos los productos:", productos);

const productById = productManager.getProductById(3);
console.log("Producto ID = 3:", productById);

const productByIdNotFound = productManager.getProductById(100);
console.log("Producto ID = 10:", productByIdNotFound);
