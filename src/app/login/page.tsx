"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState(''); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://assignment.stage.crafto.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData); 
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      router.push('/quote');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-lg transform transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Login</h1>
        {error && (
          <p id="login-error" className="text-sm text-red-600 text-center mb-4" role="alert">
            {error}
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'login-error' : undefined}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'login-error' : undefined}
              placeholder="Enter your OTP"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
