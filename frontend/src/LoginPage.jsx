import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API = import.meta.env.VITE_BACK_URI;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('ATTEMPTING TO LOG IN WITH:', { email, password });

    try {

      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 

      navigate('/tasks');

    }  catch (err) {
      console.error("Login error details:", err);
    
      let errorMessage = 'An unknown error occurred.';
    
     
      if (err.response) {        
        errorMessage = err.response.data?.msg || err.response.data?.message || err.response.data?.error || err.response.statusText;
        console.error("Server responded with an error:", err.response.status, err.response.data);
      } 
      
      else if (err.request) {
        errorMessage = 'Could not connect to the server. Please check your network connection.';
        console.error("No response received:", err.request);
      } 

      else {
        errorMessage = err.message;
        console.error("Error setting up the request:", err.message);
      }
    
      alert(errorMessage);
    
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='min-w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-600 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl w-full max-w-md shadow-xl p-8 border'>
        <h1 className='text-center text-2xl font-bold mb-6'>LOGIN PAGE</h1>
        <form onSubmit={handleLogin} className='flex flex-col items-center'>
          <input
            type="email" 
            placeholder='EMAIL'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-3 mb-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500'
            required
          />

          <div className='relative w-full mb-4'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='PASSWORD'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(s => !s)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none'
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <button
            type='submit'
            className={`w-full text-lg text-white font-semibold p-3 rounded-lg bg-green-500 hover:bg-green-600 transition-colors duration-300 ${loading ? "cursor-wait opacity-70" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className='mt-6 text-center text-gray-600'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-blue-600 hover:underline font-bold'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;