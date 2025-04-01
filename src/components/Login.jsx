import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for redirects with success messages
  useEffect(() => {
    // Check if user was redirected from registration page
    const params = new URLSearchParams(location.search);
    const fromRegister = params.get('registered');
    
    if (fromRegister === 'true') {
      setSuccess('Registration successful! Please log in to continue.');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(formData.username, formData.password);
      setSuccess('Login successful! Redirecting...');
      
      // Redirect after a brief delay so user can see success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    return `w-full p-3 sm:p-4 border-2 ${
      errors[fieldName] 
        ? 'border-red-300 bg-red-50' 
        : 'border-rose-100'
    } rounded-lg focus:outline-none focus:border-rose-300 placeholder-gray-400 text-sm sm:text-base`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="DISHA Logo" className="w-40 sm:w-48 md:w-52" />
            <h2 className="mt-4 text-xl sm:text-2xl font-bold text-gray-800">Login to Your Account</h2>
          </div>
          
          {/* General error message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
              {errors.general}
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg">
              {success}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={getInputClassName('username')}
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-red-500 text-xs">{errors.username}</p>
              )}
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={getInputClassName('password')}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors disabled:bg-rose-300"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </div>
          </form>
          
          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <button 
                onClick={() => navigate('/register')}
                className="text-teal-500 hover:text-teal-600 font-medium"
              >
                Create one
              </button>
            </p>
            <p className="text-center text-sm">
              <button 
                onClick={() => navigate('/forgot-password')}
                className="text-gray-500 hover:text-gray-700"
              >
                Forgot password?
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;