import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="mb-4">
      
      <div className="flex items-center bg-slate-50 border border-slate-300 rounded-md px-4 py-2 focus-within:border-cyan-500 transition-all duration-300">
        <input
          id="password"
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Password"}
          type={isShowPassword ? "text" : "password"}
          className="w-full text-sm bg-transparent py-2 outline-none"
        />
        <div
          className="ml-2 text-slate-400 cursor-pointer"
          onClick={toggleShowPassword}
          title={isShowPassword ? "Hide password" : "Show password"}
        >
          {isShowPassword ? (
            <FaRegEye size={20} />
          ) : (
            <FaRegEyeSlash size={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
