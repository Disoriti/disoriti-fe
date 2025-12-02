"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({
  className,
  email,
  password,
  confirmPassword,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onGoogleSignup,
  ...props
}: React.ComponentProps<"div"> & {
  email: string
  password: string
  confirmPassword: string
  loading: boolean
  error: string
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onGoogleSignup?: () => void
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Animated Background Effects - Reduced */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-sm border border-primary/15 rounded-2xl p-8 bg-gradient-to-br from-background/80 via-background/60 to-background/80 shadow-lg"
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/logo-primary.png"
              alt="Disoriti Logo"
              width={40}
              height={40}
              className="size-10"
            />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Join Disoriti
            </h1>
            <p className="text-muted-foreground text-sm">
              Start creating amazing content with AI
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Google Signup Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full border border-primary/10 hover:border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-background/70 text-foreground transition-all group"
              onClick={onGoogleSignup}
              disabled={loading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-foreground">Continue with Google</span>
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <span className="text-xs text-muted-foreground bg-background px-3">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary/70" />
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={onEmailChange}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary/70" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={onPasswordChange}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary/70" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-md transition-all group"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary/80 hover:text-primary font-medium transition-colors underline underline-offset-4">
              Sign in
            </Link>
          </p>
          <div className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary/80 hover:text-primary hover:underline">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary/80 hover:text-primary hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
