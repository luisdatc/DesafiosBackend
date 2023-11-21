import React from "react";
import { Col } from "react-bootstrap";
import "./ProductCard.scss";
import { Link } from "react-router-dom";

const ProductCard = ({
  title,
  description,
  price,
  code,
  stock,
  category,
  thumbnails,
  _id
}) => {
  return (
    <Col sm={12} md={6} lg={6} xl={4}>
      <Link to={`/productdetail/${_id}`} key={_id}>
        <div className="card product-card m-1" /* style="width: 18rem" */>
          <img
            src={thumbnails[0]}
            className="card-img-top img-fluid"
            alt={title}
          />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text text-center">${price}</p>


          </div>
          </div>
          {/*<div className="card-body">
                       <p className="card-text">{description}</p> 
            <p className="card-text">{category} </p>*/}
            {/* <div className="card-sub  d-flex justify-content-evenly ">
                          <p className="card-text">{code} </p> 
              <p className="card-text">{stock} </p>
            </div>*/}
            
        {/* </div> */}
      </Link>
    </Col>
  );
};

export default ProductCard;
