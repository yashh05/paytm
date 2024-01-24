import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Signin = () => {

  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    'signin-username': '',
    'signin-password': '',
  });

  const [error,setError]=useState("")

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };


  const handleError=(error)=>{
    if(error.code===11000){
        setError("Username already exists")
    }
    else if(error.name==='ZodError'){
        setError(error.issues[0].message)
    }else{
      setError(error)
    }
  }
  const handleSignin = async (e) => {
    e.preventDefault();

    
    const collectedData={
        username: formData['signin-username'],
        password: formData['signin-password']
    }


    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectedData),
      });
      
      const result= await response.json();

      if (response.ok) {
        localStorage.setItem("token","Bearer "+result.token )
        navigate("/dashboard");
      } else {
        handleError(result.error);
      }
    } catch (error) {
      console.error('An error occurred during registration', error);
    }
  };

  return (
    <div className="bg-[#7E7F7E] w-full h-full pt-28">
      <div className="flex flex-col items-center bg-white rounded-md p-4 gap-5 w-1/3 m-auto text-[#7b7e83] font-poppins">
        <h1 className="text-black font-semibold text-3xl">Sign In</h1>
        {error?<p className=' text-red-700'>{error}</p>:null}
        <p>Enter your information to create an account</p>
        <form className="flex flex-col w-full gap-2 text-[#484849]" onSubmit={handleSignin}>
          <label htmlFor="signin-username" className="text-lg font-semibold text-black">
            username
          </label>
          <input
            type="text"
            id="signin-username"
            className="outline-none p-2 border"
            placeholder="yash11"
            value={formData['signin-username']}
            onChange={handleInputChange}
          />
          <label htmlFor="signin-password" className="text-lg font-semibold text-black">
            Password
          </label>
          <input
            type="password"
            id="signin-password"
            className="outline-none p-2 border"
            placeholder="Yash@321"
            value={formData['signin-password']}
            onChange={handleInputChange}
          />
          <button type="submit" className="bg-black w-1/3 rounded-md text-white m-auto py-2">
            Sign In
          </button>
        </form>
        <p className='text-black'>
          Don't have an account yet? <span className='underline'> <Link to="/signup">Signup</Link></span>
        </p>
      </div>
    </div>
  );
};

export default Signin;
