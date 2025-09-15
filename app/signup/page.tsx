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
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
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
        />
      </div>
    </div>
  )
}
