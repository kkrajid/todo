import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import logo from "../assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    
    // Validate required fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        const fieldName = key.replace('_', ' ');
        newErrors[key] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
    }
    
    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password strength
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    // Validate password match
    if (formData.password && formData.password2 && formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
      });
      
      // Redirect after a brief delay so user can see success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      const apiErrors = {};
      
      if (err.response && err.response.data) {
        // Process backend validation errors
        Object.entries(err.response.data).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value;
        });
      } else {
        apiErrors.general = 'Registration failed. Please try again later.';
      }
      
      setErrors(apiErrors);
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
            <h2 className="mt-4 text-xl sm:text-2xl font-bold text-gray-800">Create Account</h2>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  className={getInputClassName('first_name')}
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <p className="mt-1 text-red-500 text-xs">{errors.first_name}</p>
                )}
              </div>
              
              <div>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  className={getInputClassName('last_name')}
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <p className="mt-1 text-red-500 text-xs">{errors.last_name}</p>
                )}
              </div>
            </div>
            
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
                type="email"
                name="email"
                placeholder="Email"
                className={getInputClassName('email')}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
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
            
            <div>
              <input
                type="password"
                name="password2"
                placeholder="Confirm Password"
                className={getInputClassName('password2')}
                value={formData.password2}
                onChange={handleChange}
              />
              {errors.password2 && (
                <p className="mt-1 text-red-500 text-xs">{errors.password2}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:bg-teal-300"
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
              <button
                type="button"
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button 
              onClick={() => navigate('/login')}
              className="text-teal-500 hover:text-teal-600 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;