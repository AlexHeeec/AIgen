import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  // In a real app, you would check if the user is already authenticated
  // and redirect to the homepage if they are
  const isAuthenticated = false

  if (isAuthenticated) {
    redirect("/homepage")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-500">AIGenTest</h1>
          <p className="mt-2 text-gray-600">AI-powered test case generation platform</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
