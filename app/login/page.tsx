"use client"

import { useState } from "react"
import { LoginForm } from "@/app/login/login-form"
import { toast } from "sonner"

import { API_LOGIN_URL } from "@/lib/links"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        toast.error("Invalid credentials")
        return
      }
      const result = await res.json()
      const token = result.data?.access_token
      if (!token) {
        toast.error("No token returned from server")
        return
      }
      toast.success("Login successful!")
      localStorage.setItem("token", token)
      // Optionally store user info: result.data.user
      // Redirect or update UI as needed
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
        <LoginForm
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={e => setEmail(e.target.value)}
          onPasswordChange={e => setPassword(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
