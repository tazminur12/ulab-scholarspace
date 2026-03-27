"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((user) => user.email === email)) {
      setError("An account with this email already exists.");
      return;
    }

    // Create and save user
    const newUser = { fullName, studentId, email, department, semester, password, role: 'student' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login and redirect
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row">
        {/* Left Side: Image & Welcome Text */}
        <div className="w-full md:w-1/2 bg-[#1e3a8a] text-white p-12 flex flex-col justify-center items-center rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
          <h1 className="text-3xl font-bold font-poppins mb-4">Welcome to ULAB Scholar Space</h1>
          <p className="text-center text-blue-100">Join our community of scholars and start collaborating today. Unlock your full potential.</p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 font-poppins mb-2">Create Account</h2>
          <p className="text-sm text-gray-600 mb-8">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#1e3a8a] hover:text-blue-700">
              Log in
            </Link>
          </p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]" />
              <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]" />
            </div>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select value={department} onChange={(e) => setDepartment(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a] text-gray-500">
                <option value="">Department</option>
                <option>CSE</option>
                <option>BBA</option>
                <option>DEH</option>
              </select>
              <select value={semester} onChange={(e) => setSemester(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a] text-gray-500">
                <option value="">Semester</option>
                {[...Array(8)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]" />
            
            <button type="submit" className="w-full bg-[#1e3a8a] text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
