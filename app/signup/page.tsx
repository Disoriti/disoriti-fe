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
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { isAuthenticated, register } = useAuth()
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
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    
    const success = await register({ email, password })
    if (success) {
      router.push('/login')
    } else {
      setError("Failed to create account. Please try again.")
    }
    
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = API_URLS.GOOGLE_AUTH_URL
    } catch (error) {
      console.error('Google signup error:', error)
      setError("Failed to initiate Google signup")
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95"></div>
      
      {/* Subtle glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,255,169,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'scale(1.2)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,255,169,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'scale(1.2)',
          }}
        />
      </div>
      
      <div className="relative w-full max-w-md z-10">
        <SignupForm
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          loading={loading}
          error={error}
          onEmailChange={e => setEmail(e.target.value)}
          onPasswordChange={e => setPassword(e.target.value)}
          onConfirmPasswordChange={e => setConfirmPassword(e.target.value)}
          onSubmit={handleSubmit}
          onGoogleSignup={handleGoogleSignup}
        />
      </div>
    </div>
  )
}
