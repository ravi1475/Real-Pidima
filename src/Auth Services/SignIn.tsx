import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type UserType = 'user' | 'admin';

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if user is already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/');
    }
  }, [navigate]);
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    rememberMe: Yup.boolean()
  });

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log in the user (this would be an actual API call in a real app)
        console.log('Logging in as', userType, 'with values:', values);
        
        // Store auth token in localStorage
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        toast.success(`Successfully logged in as ${userType}`);
        
        // Redirect after successful login
        setTimeout(() => {
          navigate(userType === 'admin' ? '/admin/dashboard' : '/');
        }, 1000);
      } catch (error) {
        toast.error('Login failed. Please try again.');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  const handleToggleUserType = (type: UserType) => {
    setUserType(type);
  };

  const fillDemoCredentials = (type: UserType) => {
    if (type === 'user') {
      formik.setValues({
        email: 'user@example.com',
        password: 'userpassword',
        rememberMe: formik.values.rememberMe
      });
    } else {
      formik.setValues({
        email: 'admin@example.com',
        password: 'adminpassword',
        rememberMe: formik.values.rememberMe
      });
    }
  };

  const handleForgotPassword = () => {
    toast.success('Password reset link sent to your email');
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 animate-fadeIn">
      <ToastContainer 
        position="bottom-right" 
        theme="colored" 
        autoClose={3000}
      />
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8">
            {/* User type toggle */}
            <div className="flex p-1 mb-6 space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                type="button"
                className={`w-full py-2 text-sm font-medium rounded-md focus:outline-none transition-all duration-200 ${
                  userType === 'user'
                    ? 'bg-white dark:bg-gray-700 shadow text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => handleToggleUserType('user')}
              >
                User
              </button>
              <button
                type="button"
                className={`w-full py-2 text-sm font-medium rounded-md focus:outline-none transition-all duration-200 ${
                  userType === 'admin'
                    ? 'bg-white dark:bg-gray-700 shadow text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => handleToggleUserType('admin')}
              >
                Admin
              </button>
            </div>

            <div className="mt-6">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`block w-full px-3 py-2 placeholder-gray-400 border rounded-md shadow-sm appearance-none dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200 ${
                        formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className={`block w-full px-3 py-2 placeholder-gray-400 border rounded-md shadow-sm appearance-none dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200 ${
                        formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <FaEye className="w-5 h-5" aria-hidden="true" />
                      )}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800"
                      onChange={formik.handleChange}
                      checked={formik.values.rememberMe}
                    />
                    <label htmlFor="rememberMe" className="block ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 focus:outline-none transition-all duration-200"
                      onClick={handleForgotPassword}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('user')}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Demo User Login
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Demo Admin Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700">
          <div className="flex items-center justify-center h-full p-8">
            <div className="max-w-lg text-center">
              <h2 className="text-4xl font-bold text-white">Welcome to Pidima</h2>
              <p className="mt-4 text-xl text-emerald-100">
                Your personal digital management assistant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 