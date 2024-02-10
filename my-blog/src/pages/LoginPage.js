import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'

const LoginPage=()=>{

    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[error,setError]=useState('')
// setting error so that when the user details are wrong this can be displayed
    const navigate  = useNavigate();  //to redirect to dashboard page after successful login.

    const login=async()=>{
        try{
            await signInWithEmailAndPassword(getAuth(),email,password);
            navigate('/articles')  //use this so that after login you can go to the article dashboard page directly
        }catch(e){
            setError(e.message);
        }
    }


    return(
    <>

    <h3>Login Page</h3>
    {/* below is the default method to display error data in react */}
    {error && <p className="error">{error}</p>}

    <input
        placeholder="Your Email Address"
        value={email}
        onChange={e => setEmail(e.target.value)}/>
        
    <input 
        placeholder="Your Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
        type="password" />

    <button onClick={login}>Log In</button>

    <Link to="/create-account">Don't have an account? Create One here</Link>
    
    
    </>    
   
    
)}

export default LoginPage; 

