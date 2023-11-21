import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./components/LoginRegister/LoginRegister";
import NewProduct from "./components/NewProduct/NewProduct";
import NavBar from "./components/NavBar/NavBar";
import Products from "./components/Products/Products";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { LogProvider } from "./components/LogContext";
import ProductDetail from "./ProductDetail/ProductDetail";

function App() {
  return (
    <LogProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/usuario" element={<LoginRegister />} />
          <Route path="/new-product" element={<NewProduct />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productdetail/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </LogProvider>
  );
}

export default App;
