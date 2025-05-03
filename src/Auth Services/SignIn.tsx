import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaClipboardList, FaDatabase } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuth } from './UserService';

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const userAuth = useUserAuth();
  
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
      .required('Password is required')
  });

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const success = await userAuth.login(values.email, values.password);
        
        if (!success) {
          throw new Error('Login failed');
        }
        
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  const fillDemoCredentials = () => {
    formik.setValues({
      email: 'user@example.com',
      password: 'userpassword'
    });
  };

  // User welcome message
  const welcomeMessage = {
    title: "Welcome to Pidima",
    subtitle: "Your personal digital management assistant.",
    description: "Access your personal workspace and manage your requirements, test specifications, and more. Track your project's progress with ease.",
    features: [
      { icon: <FaClipboardList />, text: "Manage requirements and specifications" },
      { icon: <FaDatabase />, text: "Track test cases and results" }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-white dark:bg-gray-900"
    >
      <ToastContainer 
        position="bottom-right" 
        theme="colored" 
        autoClose={3000}
      />
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <motion.h2 
              className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Sign in to your account
            </motion.h2>
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
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

                  <div className="pt-2">
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 focus:outline-none transition-all duration-200"
                      >
                        Use demo credentials
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`flex justify-center w-full px-4 py-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
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
                      `Sign in`
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            backgroundSize: '200% 200%',
          }}
        >
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)'
              ]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          />
          <div className="flex items-center justify-center h-full p-8">
            <div className="max-w-lg">
              <motion.h2 
                className="text-4xl font-bold text-white text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                {welcomeMessage.title}
              </motion.h2>
              <motion.p 
                className="mt-4 text-xl text-center text-green-50"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                {welcomeMessage.subtitle}
              </motion.p>
              <motion.div
                className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.7 }}
              >
                <p className="text-green-50 mb-6">
                  {welcomeMessage.description}
                </p>
                <div className="space-y-4">
                  {welcomeMessage.features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2 + (index * 0.2), duration: 0.5 }}
                    >
                      <div className="flex-shrink-0 p-2 bg-white/20 rounded-full mr-3">
                        {feature.icon}
                      </div>
                      <p className="text-green-50">{feature.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignIn; 