"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaGoogle, FaLock, FaEnvelope } from "react-icons/fa"

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Please input your email!")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email!")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Please input your password!")
      return false
    }
    setPasswordError("")
    return true
  }

  const onFinish = async () => {
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    try {
      setLoading(true)
      // In a real app, you would call your authentication API here
      console.log("Login with:", { email, password })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      alert("Login successful!")
      router.push("/homepage")
    } catch (error) {
      alert("Login failed. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      // In a real app, you would initiate Google OAuth flow here
      console.log("Login with Google")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      alert("Google login successful!")
      router.push("/homepage")
    } catch (error) {
      alert("Google login failed. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onFinish()
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            prefix={<FaEnvelope />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input
            type="password"
            prefix={<FaLock />}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
        </div>

        <div>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            Log in
          </Button>
        </div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <Button icon={<FaGoogle />} onClick={handleGoogleLogin} className="w-full" loading={loading}>
        Continue with Google
      </Button>
    </div>
  )
}
