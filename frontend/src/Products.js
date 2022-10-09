import React, {useEffect, useState} from 'react'
import Card from "./components/Card";
const Products = () => {

  const [products, setProducts] = useState([]);
   useEffect(() => {
    fetch("/products/all", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json"
        },
        credentials: "include"
    }).then((res) => {
      console.log(res);
        setProducts(res);
      // console.log(products);
        if( res.status === 400 || !res){
            window.alert(res.error)
        }
    }).catch((err) =>{
        console.log(err);
    })
  });

  return (
    <div className='wrapper'>
    {[products].map((product, index) => (
        <Card
          key = {index}
          img={product.productImage}
          title={product.productName}
          description={product.productDescription}
          price= {product.productPrice}
        />
    ))}
    </div>
  )
}

export default Products;
