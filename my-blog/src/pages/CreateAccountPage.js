import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import {getAuth,createUserWithEmailAndPassword} from'firebase/auth';

const CreateAccountPage=()=>{

    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[confirmPassword,setConfirmPassword]=useState('')
    const[error,setError]=useState('')
    
    const navigate  = useNavigate(); 
    const createAccount=async()=>{
        try{
            if(password!==confirmPassword){
                setError("The password and confirmation password do not match.")
                return;
            }
            else{
                await createUserWithEmailAndPassword(getAuth(),email,password,confirmPassword);
                navigate('/articles');
            }
        }catch(e){
            setError(e.message);
        }
    }
    return(
    <>     
        
    <h1>Create account Page</h1>
    <h3>Create Account</h3>
    
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
    
    <input 
        placeholder="Re-enter Password"
        value={confirmPassword}
        onChange={e=>setConfirmPassword(e.target.value)}
        type="password" />

    <button onClick={createAccount}>Create Account</button>

    <Link to="/create-account">Don't have an account? Create One here</Link>
    
    </>    
)}

export default CreateAccountPage;

