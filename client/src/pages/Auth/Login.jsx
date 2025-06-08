import React, { useState } from 'react'; 
import { validateEmail } from '../../utils/helper';
import { useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../utils/axiosinstance';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      const response = await axiosInstance.post("/login", {
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
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />

      <div className="container h-auto min-h-screen flex flex-col lg:flex-row items-center justify-center mt-2 px-4 lg:px-20 mx-auto">
        <div className="w-full md:w-3/5 lg:w-2/5 h-[40vh] md:h-[60vh] lg:h-[80vh] mb-4 flex items-end bg-login-bg-img bg-cover bg-center rounded-2xl p-4 md:p-6 lg:p-10 z-50">
          <div>
            <h4 className="text-3xl lg:text-5xl text-white font-semibold">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-sm lg:text-[15px] text-white mt-4 leading-6 pr-2 lg:pr-7">
              Record your travel experiences and memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/4 max-w-xl h-auto bg-white rounded-3xl mb-6 relative mt-6 lg:mt-0 lg:ml-12 p-6 lg:p-16 shadow-lg shadow-cyan-200">
          <form onSubmit={handleLogin}>
            <h4 className="text-xl lg:text-2xl font-semibold mb-7 text-center">Login</h4>
			<div className="mb-6">
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
              LOGIN
            </button>
            
            <p className="text-sm text-slate-500 text-center my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => navigate("/signup")}
            >
              CREATE ACCOUNT
            </button>
			</div>
			
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
