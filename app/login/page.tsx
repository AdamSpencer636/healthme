"use client"

import { Input, Button } from '@nextui-org/react'
import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'


const LoginPage = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    

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
            // Redirect to root
            window.location.href = '/';
        } else {
            console.log(error)
            alert('Invalid credentials')
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
            </div>
        </div>
    )
}

export default LoginPage