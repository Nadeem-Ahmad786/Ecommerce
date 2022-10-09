 import React from 'react'

// const Cart = () => {

//     const [user, setUser] = useState({
//         user_id: "", product_id: "", quantity: ""
//     });
//     let name, value;
//     const handleInput = (e) => {
//         name = e.target.name;
//         value = e.target.value;

//         setUser({...user, [name]: value});
//     } 
//     const PostData = async(e) =>{
//        e.preventDefault();
//        const {email, password} = user;
//        const res = await fetch("/loginUser", {
//         method: "POST",
//         headers: {
//             "Content-Type" : "application/json"
//         },
//         body: JSON.stringify({
//             email, password
//         })
//        }) ;
//        const data = await res.json();
//             if( data.status === 400 || !data){
//                 window.alert(data.message)
//             }
//             else{
//                 window.alert(data.message);
//                 navigate("/");
//             }
//     }


















const Cart = () => {
  return (
    <div>Cart</div>
  )
}

export default Cart