"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FaSignOutAlt, FaUser } from "react-icons/fa"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // In a real app, you would call your logout API here
    console.log("Logging out")
    router.push("/")
  }

  // Handle click outside for user menu
  const handleClickOutside = (e: React.MouseEvent) => {
    if (menuOpen) {
      const target = e.target as HTMLElement
      if (!target.closest(".user-menu")) {
        setMenuOpen(false)
      }
    }
  }

  // Check if current path matches navigation item
  const isActive = (path: string) => {
    return pathname === path
  }

  const getNavButtonClass = (path: string) => {
    const baseClass = "px-4 py-1 font-medium transition-colors"
    if (isActive(path)) {
      return `${baseClass} border-b-2 border-blue-500 text-blue-500`
    }
    return `${baseClass} text-gray-600 hover:text-blue-500`
  }

  return (
    <div className="min-h-screen flex flex-col" onClick={handleClickOutside}>
      <header className="bg-white px-6 py-3 shadow-sm flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-500 m-0">AIGenTest</h1>
          <div className="ml-6 flex items-center space-x-6">
            <button onClick={() => router.push("/homepage")} className={getNavButtonClass("/homepage")}>
              <span>Home</span>
            </button>
            <button onClick={() => router.push("/prd-list")} className={getNavButtonClass("/prd-list")}>
              <span>PRD Library</span>
            </button>
            <button onClick={() => router.push("/case-task-list")} className={getNavButtonClass("/case-task-list")}>
              <span>TestCase Tasks</span>
            </button>
          </div>
        </div>

        <div className="relative user-menu">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center cursor-pointer">
            <span className="mr-2 hidden sm:inline text-sm font-medium text-gray-700">John Doe</span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-600" style={{ width: "16px", height: "16px" }} />
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" style={{ width: "14px", height: "14px" }} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        <div className="grid grid-cols-12 h-[calc(100vh-57px)]">{children}</div>
      </main>
    </div>
  )
}
