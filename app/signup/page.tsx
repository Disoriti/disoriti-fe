"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/signup-form"
import { useAuth } from "@/contexts/auth-context"
import { API_URLS } from "@/lib/api"
import { toast } from "sonner"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(API_URLS.SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        
        // Handle 401 Unauthorized - redirect to login
        if (res.status === 401) {
          toast.error('Session expired. Please log in again.');
          // Clear authentication and redirect to login
          logout();
          return;
        }
        
        // Show the message field as the primary error message for other errors
        const errorMessage = errorData.message || "Error in signing up"
        toast.error(errorMessage)
        return
      }
      
      const result = await res.json()
      const token = result.data?.access_token
      if (!token) {
        toast.error("No access token returned")
        return
      }
      
      toast.success("Signup successful! Please log in.")
      router.push('/login')
    } catch (err: any) {
      toast.error("Network or server error")
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm
          email={email}
          password={password}
          username={username}
          loading={loading}
          error={error}
          onEmailChange={e => setEmail(e.target.value)}
          onPasswordChange={e => setPassword(e.target.value)}
          onUsernameChange={e => setUsername(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
