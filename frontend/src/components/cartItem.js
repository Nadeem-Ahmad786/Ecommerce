import React from 'react'

const CartItem = (props) => {
  const tempCss ={
    height: "112px",
    width: "112px",
  }
  return (
    <div className="cartMain">
      <div className="subCart">
        <div className="imgDiv" style={tempCss}>
          <img className="cartImage" src={props.productImage} alt="Cart Item image"/>
         </div>
        <h3>{props.productName}</h3>
        <h3 className='price'>₹ {props.productPrice}</h3>
       </div>
      <div className="subcartSecond">
        <button>+</button>
        <p>{props.quantity}</p>
        <button>-</button>
        </div>
    </div>
  )
}

export default CartItem;