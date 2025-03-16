import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

const LoginPage = () => {
  const {login, isLoggingIn} = useAuthStore();
  const [showPassword,setShowPassword] = useState(false);
    const [formData,  setFormData]  = useState(
      {
        "email": "",
        "password": "",
      }
    );
  
    const validateForm = () => {
      if (!formData.email.trim()) return toast.error("Email is required");
      let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(!emailRegex.test(formData.email.trim())) return toast.error("Invalid Email")
      if (!formData.password.trim()) return toast.error("Password is required");
      return true;
    }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const success = validateForm();
      if(success) {
        
        login(formData);
      } 
    }
    return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex-col items-center gap-2 group:'>
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="size-6 z-1 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Login Account</h1>
              <p className="text-base-content/60">Sign in to start messaging</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 z-1 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="JohnDoe@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 z-1 text-base-content/40" />
                </div>
                <input
                  type={showPassword?'text':'password'}
                  className="input input-bordered w-full pl-10"
                  placeholder="*********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type='button'onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                  {showPassword?
                  <Eye className="size-5 text-base-content/40" />:
                  <EyeOff className="size-5 text-base-content/40" />
                  }                
                </button>
              </div>
            </div>
            <button type='submit'className='btn btn-primary w-full'  disabled={isLoggingIn}>
              {isLoggingIn?(
                <Loader2 className='size-5 animate-spins' />):
                ('Log in')
              }
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account?{" "}
              <Link to="/signup" className="link link-primary">
              Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right side */}
      <AuthImagePattern
      title="Join Our Community"
      subtitle="Join our community of passionate individuals who are shaping the future of technology and innovation."
      />
    </div>
    )
}

export default LoginPage
