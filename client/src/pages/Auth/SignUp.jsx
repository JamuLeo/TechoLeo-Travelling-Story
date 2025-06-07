import React, { useState } from 'react';
import { validateEmail } from '../../utils/helper';
import { useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../utils/axiosinstance';

const SignUp = () => {
  const [name, setName] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    setError("");

    try {
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
      if (error.response?.data?.message) {
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

      <div className="container h-screen flex items-center  justify-center px-20 mx-auto">
        {/* Left Panel */}
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-white font-semibold ">
              Join the <br /> Adventure
            </h4>
            <p className="text-[15px] text-white mt-4 leading-6 pr-7">
              Create an account to start documenting your travels and preserving your memories in your personal travel journal.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold text-center mb-7">SignUp</h4>

            
              
              <input
                type="text"
                placeholder="fullname"
                className="input-box  "
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
              <input
                type="text"
                placeholder="email"
                className="input-box"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
             
              <PasswordInput
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <button type="submit" className="btn-primary mt-4 w-full">
              CREATE ACCOUNT
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light w-full"
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

