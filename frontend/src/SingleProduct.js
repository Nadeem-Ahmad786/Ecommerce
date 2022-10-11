import React, {useContext} from 'react'
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { UserContext } from './App';
import { Button } from "./styles/Button";
const SingleProduct = () => {
  const {id} = useParams();
 const singleProductData = useLocation();
  // console.log(id)
  // console.log(data.state.description);
  const {state, dispatch} = useContext(UserContext);

  const PostData = async(e) =>{
    e.preventDefault();
    const user_id = state[1]._id;
    const product_id = singleProductData.state.product_id;
    const res = await fetch("/cart", {
     method: "POST",
     headers: {
         "Content-Type" : "application/json"
     },
     body: JSON.stringify({
         user_id, product_id
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
    <div className='main_div'>
    <div className="container">
    <div className="sub_con">
      <img className="single_img" src={singleProductData.state.product_img} alt={id}/>
      <h2>{id}</h2>
      <h3>{singleProductData.state.description}</h3> 
      <form method="post">
      <Button onClick={PostData}>Add to Cart</Button>
      </form>
    </div>
    </div>
    </div>
  );
}

export default SingleProduct;