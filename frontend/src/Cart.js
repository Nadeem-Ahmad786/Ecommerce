import React, {useEffect, useState}from 'react'
import CartItem from './components/cartItem';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    fetch("/cart", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json"
        },
        credentials: "include"
    }).then((res) => res.json())
      .then((products) => {
          setCartProducts(products);
    }).catch((err) =>{
        console.log(err);
    });
  });
  // console.log(cartProducts);
  return (
    <>
      {cartProducts.map((cartProduct) =>(
        <CartItem 
          key={cartProduct.productId}
          product_id = {cartProduct.productId}
          productName ={cartProduct.productName}
          productImage ={cartProduct.productImage}
          productPrice ={cartProduct.productPrice}
          quantity ={cartProduct.quantity}
        />
      ))}
      </>
  )
}

export default Cart