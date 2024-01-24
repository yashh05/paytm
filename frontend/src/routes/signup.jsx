import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom';

const Signup = () => {

  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    'signup-firstname': '',
    'signup-lastname': '',
    'signup-username': '',
    'signup-password': '',
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
    }
    else{
      setError(error.message)
    }
  }
  const handleSignup = async (e) => {
    e.preventDefault();

    
    const collectedData={
        firstname: formData['signup-firstname'],
        lastname: formData['signup-lastname'],
        username: formData['signup-username'],
        password: formData['signup-password']
    }


    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/user/signup', {
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
    <div className="bg-[#7E7F7E] w-full h-full pt-8">
      <div className="flex flex-col items-center bg-white rounded-md p-4 gap-5 w-1/3 m-auto text-[#7b7e83] font-poppins">
        <h1 className="text-black font-semibold text-3xl">Sign Up</h1>
        <p className=' text-red-700'>{error}</p>
        <p>Enter your information to create an account</p>
        <form className="flex flex-col w-full gap-2 text-[#484849]" onSubmit={handleSignup}>
          <label htmlFor="signup-firstname" className="text-lg font-semibold text-black">
            First Name
          </label>
          <input
            type="text"
            id="signup-firstname"
            className="outline-none p-2 border"
            placeholder="Yash"
            value={formData['signup-firstname']}
            onChange={handleInputChange}
          />
          <label htmlFor="signup-lastname" className="text-lg font-semibold text-black">
            Last Name
          </label>
          <input
            type="text"
            id="signup-lastname"
            className="outline-none p-2 border"
            placeholder="Sharma"
            value={formData['signup-lastname']}
            onChange={handleInputChange}
          />
          <label htmlFor="signup-username" className="text-lg font-semibold text-black">
            username
          </label>
          <input
            type="text"
            id="signup-username"
            className="outline-none p-2 border"
            placeholder="yash11"
            value={formData['signup-username']}
            onChange={handleInputChange}
          />
          <label htmlFor="signup-password" className="text-lg font-semibold text-black">
            Password
          </label>
          <input
            type="password"
            id="signup-password"
            className="outline-none p-2 border"
            placeholder="Yash@321"
            value={formData['signup-password']}
            onChange={handleInputChange}
          />
          <button type="submit" className="bg-black w-1/3 rounded-md text-white m-auto py-2">
            Signup
          </button>
        </form>
        <p className='text-black'>
          Already have an account? <span className='underline'> <Link to="/signin">Signin</Link></span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
