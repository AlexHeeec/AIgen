"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would validate credentials here
    console.log("Login attempt:", { email, password })

    // Redirect to homepage after successful login
    router.push("/homepage")

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">AIGenTest</h1>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">AI-powered PRD and Test Case Generation Platform</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
