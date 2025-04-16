import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Basic email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Invalid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.trim().length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { email: email.trim(), password: password.trim() });
    
    if (validateForm()) {
      console.log('Form validation passed');
      
      // Check credentials (trimming whitespace)
      const isValidCredentials = 
        email.trim() === 'admin@example.com' && 
        password.trim() === 'password12345';

      console.log('Credentials valid:', isValidCredentials);

      if (isValidCredentials) {
        console.log('Login successful, setting authentication');
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        console.log('Invalid credentials, showing error');
        setErrors({
          email: 'Invalid credentials',
          password: 'Invalid credentials'
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-sky-100 overflow-hidden">
        <div className="bg-sky-500/10 text-sky-800 text-center py-6">
          <h2 className="text-3xl font-bold tracking-wide">
            Admin Dashboard
          </h2>
          <p className="text-sm text-sky-600 mt-2">
            Secure Administrative Access
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="p-8 space-y-6"
        >
          {/* Email Input */}
          <div className="relative">
            <label 
              className="block text-sky-800 text-sm font-semibold mb-2" 
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.trim()); // Trim whitespace on input
                  setErrors({});
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 transition-all duration-300 bg-sky-50 ${
                  errors.email 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                    : 'border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                }`}
                placeholder="Enter your admin email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label 
              className="block text-sky-800 text-sm font-semibold mb-2" 
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.trim()); // Trim whitespace on input
                  setErrors({});
                }}
                className={`w-full pl-10 pr-12 py-2 rounded-lg border-2 transition-all duration-300 bg-sky-50 ${
                  errors.password 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                    : 'border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-3 rounded-lg font-bold 
            hover:bg-sky-600 transition-all duration-300 
            transform hover:-translate-y-1 hover:shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            Login to Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;