

 import React, { useState } from 'react'; 
import { validateEmail } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../utils/axiosinstance';


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();
   
    
    if (!name) {
      setError("Please enter your name");
      return;
    }
	   if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError(""); 

    try {
      // SignUp API call
      const response = await axiosInstance.post("/create-account", {
        fullName: name,     
	    email: email,
        password: password,
      });

      
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50  overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />

      <div className="container h-auto min-h-screen flex flex-col lg:flex-row items-center justify-center mt-2 px-4 lg:px-20 mx-auto ">
        <div className="w-full md:w-3/5 lg:w-2/5 h-[40vh] md:h-[60vh] lg:h-[80vh] mb-4 flex items-end bg-signup-bg-img bg-cover bg-center rounded-2xl p-4 md:p-6 lg:p-10 z-50">
          <div>
            <h4 className="text-3xl lg:text-5xl text-white font-semibold">
              Join the <br /> Adventure
            </h4>
            <p className="text-sm lg:text-[15px] text-white mt-4 leading-6 pr-2 lg:pr-7">
              Create an account and start documenting your travels and preserving your memories
			  in your personal travel journal.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/4 max-w-xl h-auto bg-white mb-4 rounded-lg relative mt-6 lg:mt-0 lg:ml-12 p-6 lg:p-16 shadow-lg shadow-cyan-200">
          
          <form onSubmit={handleSignUp}>
            <h4 className="text-xl lg:text-2xl font-semibold mb-7 text-center">SignUp</h4>
            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

			  <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            
           
            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
          CREATE ACCOUNT
            </button>

            <p className="text-sm text-slate-500 text-center  my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light "
              onClick={() => navigate("/login")}
            >
             LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
 
