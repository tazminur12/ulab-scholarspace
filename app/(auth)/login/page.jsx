"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Sample users for demo
    const sampleUsers = [
      { email: "student@ulab.edu", password: "password123", role: "student", fullName: "Test Student" },
      { email: "admin@ulab.edu", password: "admin123", role: "admin", fullName: "Test Admin" }
    ];
    
    const users = JSON.parse(localStorage.getItem('users') || '[]').concat(sampleUsers);

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row-reverse">
        {/* Right Side: Image & Welcome Text */}
        <div className="w-full md:w-1/2 bg-[#1e3a8a] text-white p-12 flex flex-col justify-center items-center rounded-t-2xl md:rounded-r-2xl md:rounded-tl-none">
          <h1 className="text-3xl font-bold font-poppins mb-4">Welcome Back!</h1>
          <p className="text-center text-blue-100">Log in to access your dashboard, resources, and collaborate with the ULAB community.</p>
        </div>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 font-poppins mb-2">Login</h2>
          <p className="text-sm text-gray-600 mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-[#1e3a8a] hover:text-blue-700">
              Sign up
            </Link>
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-[#1e3a8a] focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#1e3a8a] hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-[#1e3a8a] text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
