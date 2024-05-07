"use client"

import { Input, Button, Link } from '@nextui-org/react'
import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const LoginPage = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

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
    };

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

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault()
        console.log(event)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        // @ts-ignore
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: Users, error } = await supabase
          .from("Users")
          .select("id")
            .eq("Username", user)
            .eq("Password", password)
        
        if (Users) {
            // Add userid to local storage
            localStorage.setItem('userid', Users[0].id)
            sendSuccessToast("Login successful")
            // Redirect to root
            window.location.href = '/';
        } else {
            console.log(error)
            sendErrorToast('Invalid credentials')
        }
    }

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-80">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <form onSubmit={handleLogin}>
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
            <Button type="submit" fullWidth>
              Login
            </Button>
          </form>
          <Link href="/signup" className="w-full justify-center flex mt-3">
            Create Account
          </Link>
          <ToastContainer />
        </div>
      </div>
    );
}

export default LoginPage