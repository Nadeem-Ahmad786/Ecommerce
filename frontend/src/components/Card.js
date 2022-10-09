import React,{useNavigate, useContext} from "react";
import {Link} from 'react-router-dom';
import { UserContext } from '../App';
const Card = (props) => {

  const {state, dispatch} = useContext(UserContext);

  const PostData = async(e) =>{
    e.preventDefault();
    const user_id = state[1]._id;
    const product_id = props.product_id;
    const quantity = 0;
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
    return (
      <div className="card">
        <img src={props.img} className="card__img" />
        <div className="card__body">
        <p className="card__title">
          <Link  to={"/singleproduct/" + props.title} state= {{description: props.description, product_id: props.product_id}}>{props.title}</Link>
          </p>
          <p className="card__description">{props.description}</p>
          <h3 className="card__price">{props.price}</h3>
          <form method="post">
          <button className="card__btn" onClick={PostData}>Add to Cart</button>
          </form>
        </div>
      </div>
    );
  }

export default Card; 
