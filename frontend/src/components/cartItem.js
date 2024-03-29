import React, {useState, useContext, useEffect} from 'react';
import {useNavigate}  from "react-router-dom";
import { UserContext } from '../App';
const CartItem = (props) => {
  const tempCss ={
    height: "112px",
    width: "112px",
  }
  const navigate = useNavigate();
  const [itemQuantity, setQuantity ] = useState(props.quantity);
  const {state, dispatch} = useContext(UserContext);
  var quantity=undefined;
  const PostData = async() =>{
    const user_id = state[1]._id;
    const product_id = props.product_id;
    // const quantity = 1;
    console.log(quantity);

    const res = await fetch("/cart", {
     method: "POST",
     headers: {
         "Content-Type" : "application/json"
     },
     body: JSON.stringify({
         user_id, product_id, quantity
     })
    }) ;
    const data = await res.json();
         if( data.status === 400 || !data){
             window.alert(data.message)
         }
         else{
             window.alert(data.message);
         }
 }


  const  incrementQuantity = async() =>{
    quantity = itemQuantity+1;
    console.log(quantity);
    await PostData();
    setQuantity(quantity);
  }

  const  decrementQuantity =  async() =>{
    if(itemQuantity>=1){
      quantity = itemQuantity -1;
      console.log(quantity);
      await PostData();
      setQuantity(quantity);
    }
  }
  useEffect(()=>{

  });

  return (
    <div className="cartMain">
      <div className="subCart">
        <div className="imgDiv" style={tempCss}>
          <img className="cartImage" src={props.productImage} alt="Cart Item"/>
         </div>
        <h3>{props.productName}</h3>
        <h3 className='price'>₹ {props.productPrice}</h3>
       </div>
      <div className="subcartSecond">
        <button onClick={incrementQuantity}>+</button>
        <p>{itemQuantity}</p>
        <button onClick={decrementQuantity}>-</button>
        </div>
    </div>
  )
}

export default CartItem;