import React, {useContext} from 'react'
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { UserContext } from './App';
const SingleProduct = () => {
  const {id} = useParams();
 const data = useLocation();
  // console.log(id)
  // console.log(data.state.description);

  const {state, dispatch} = useContext(UserContext);

  const PostData = async(e) =>{
    e.preventDefault();
    const user_id = state[1]._id;
    const product_id = data.state.product_id;
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
    <div >
      <h1>{id}</h1>
      <h3>{data.state.description}</h3> 
      <form method="post">
      <button>Add to Cart</button>
      </form>
    </div>
  );
}

export default SingleProduct;