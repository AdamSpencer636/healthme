"use client"

import { Input, Button, Link } from '@nextui-org/react'
import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignupPage = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const sendErrorToast = (message: string) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const sendWarningToast = (message: string) => {
      toast.warn(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    const sendSuccessToast = (message: string) => {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
    
    const handleSignup = async (event: FormEvent) => {
        event.preventDefault()
        console.log(event)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        // @ts-ignore
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Check if user already exists
        const { data: existingUser, error: existingUserError } = await supabase
          .from("Users")
          .select("id")
          .eq("Username", user)
        
        if (existingUser) {
            console.log(existingUser)
            sendWarningToast('User already exists')
            return;
        }

        // Create new user
        const { data: newUser, error: newUserError } = await supabase
          .from("Users")
          .insert([{ Username: user, Password: password }])
        
        if (newUser) {
            console.log(newUser)
            // Log in to the newly created user
            const { data: loggedInUser, error: loginError } = await supabase
              .from("Users")
              .select("id")
              .eq("Username", user)
              .eq("Password", password)
            
            if (loggedInUser) {
                // Add userid to local storage
                localStorage.setItem('userid', loggedInUser[0].id)
                sendSuccessToast('User created successfully')
                // Redirect to root
                window.location.href = '/';
            } else {
                console.log(loginError)
                alert('Invalid credentials')
            }
        } else {
            console.log(newUserError)
            sendErrorToast('Failed to create user')
        }
    }

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-80">
          <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
          <form onSubmit={handleSignup}>
            <Input
              label="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="mb-4"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4"
            />
            <Button type="submit" fullWidth>
              Sign Up
            </Button>
          </form>
          <Link href="/login" className="w-full justify-center flex mt-3">
            Already have an Account? Log in
          </Link>
        </div>
        <ToastContainer />
      </div>
    );
}

export default SignupPage