import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACK_URI || 'http://localhost:3000';

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmpass, setShowConfirmpass] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmpass) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username: name, 
        email,
        password,
      });
      alert("User created successfully! Please login.");
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
      console.error(err);
    }
  };

  return (
    <div className='min-h-screen min-w-full bg-gradient-to-br from-gray-300 to-gray-700 flex items-center justify-center'>
      <div className='bg-white rounded-2xl w-full max-w-lg shadow-xl p-8 border-6 border-[#c0c0c0]'>
        <h1 className='text-xl flex items-center justify-center'>Sign Up Page</h1>

        <form onSubmit={handleSignup} className='flex flex-col justify-center items-center w-full'>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type='text'
            placeholder='NAME'
            className='w-11/12 border mt-4 p-2 rounded-sm shadow-lg'
            required
          />

          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type='email'
            placeholder='EMAIL'
            className='w-11/12 border mt-4 p-2 rounded-sm shadow-lg'
            required
          />

          <div className='relative w-11/12 mt-4'>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder='PASSWORD'
              className='w-full border p-2 rounded-sm shadow-lg pr-10'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(s => !s)}
              className='absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none'
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEye />:<FaEyeSlash /> }
            </button>
          </div>

          <div className='relative w-11/12 mt-4'>
            <input
              value={confirmpass}
              onChange={e => setConfirmpass(e.target.value)}
              type={showConfirmpass ? "text" : "password"}
              placeholder='CONFIRM PASSWORD'
              className='w-full border p-2 rounded-sm shadow-lg pr-10'
              required
            />
            <button
              type='button'
              onClick={() => setShowConfirmpass(s => !s)}
              className='absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none'
              aria-label={showConfirmpass ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmpass ? <FaEye />:<FaEyeSlash /> }
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-2 mt-3">{error}</p>}

          <button type='submit' className='border rounded-sm bg-green-400 mt-3 text-xl p-2 w-40 cursor-pointer flex items-center justify-center'>
            Sign Up
          </button>
        </form>

        <p className='mt-4 ml-5'>Already have an account? <Link to='/' className='text-blue-600 underline italic font-bold'>Login</Link></p>
      </div>
    </div>
  );
}

export default SignUp;