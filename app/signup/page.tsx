"use client"

import { useState } from "react"
import { SignupForm } from "@/components/signup-form"

import { API_SIGNUP_URL } from "@/lib/links"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(API_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      })
      if (!res.ok) throw new Error("Error in signing up")
      const result = await res.json()
      const token = result.data?.access_token
      if (!token) throw new Error("No access token returned")
      localStorage.setItem("token", token)
      // Optionally store user info: result.data.user
      // Redirect or update UI as needed
    } catch (err: any) {
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
