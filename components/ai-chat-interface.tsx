"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FaPaperPlane, FaRobot, FaUser, FaComments, FaMagic } from "react-icons/fa"
import type { ExportConfig } from "@/utils/excel-export"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  version?: number
}

interface AIChatInterfaceProps {
  initialMessages: Message[]
  onVersionSelect: (version: number) => void
  onExportConfigChange: (config: ExportConfig) => void
  exportConfig: ExportConfig
}

export default function AIChatInterface({
  initialMessages = [],
  onVersionSelect,
  onExportConfigChange,
  exportConfig,
}: AIChatInterfaceProps) {
  const defaultMessage = {
    id: "default",
    content:
      "Hello! I'm your AI assistant. I can help you refine and adjust the generated test cases. What would you like to modify?",
    sender: "ai",
    timestamp: new Date(),
    version: 1,
  }

  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [defaultMessage])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update messages when initialMessages changes
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
    } else {
      setMessages([defaultMessage])
    }
  }, [initialMessages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Handle regular AI assistant interactions
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get the latest version from messages
      const latestVersion = Math.max(
        ...messages.filter((msg) => msg.version !== undefined).map((msg) => msg.version as number),
        0,
      )

      // Simulate a new version being created
      const newVersion = latestVersion + 1

      const aiResponses = [
        `I've updated the test cases based on your request. The changes have been applied successfully. (Version ${newVersion})`,
        `I've added more test cases for edge cases as requested. You can now see them in the test cases panel. (Version ${newVersion})`,
        `I've modified the priority levels of the test cases as you suggested. The changes are now reflected in the test cases panel. (Version ${newVersion})`,
        `I've updated the steps and expected results for the test cases as requested. The changes are now available. (Version ${newVersion})`,
      ]

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
        version: newVersion,
      }

      setMessages((prev) => [...prev, aiMessage])

      // In a real app, you would update the version in your state management
      // For now, we'll just simulate it
      onVersionSelect(newVersion)
    } catch (error) {
      console.error("Error sending message:", error)

      // Send error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Function to make version numbers clickable
  const formatMessageContent = (content: string, version?: number) => {
    if (!version) return content

    // Replace version numbers with clickable spans
    const versionRegex = /$$Version (\d+)$$/g
    return content.replace(versionRegex, (match, versionNum) => {
      return `<span class="version-link" data-version="${versionNum}">${match}</span>`
    })
  }

  // Handle click on version numbers
  const handleMessageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains("version-link")) {
      const version = Number.parseInt(target.getAttribute("data-version") || "0", 10)
      if (version > 0) {
        onVersionSelect(version)
      }
    }
  }

  // Show empty state when no messages (shouldn't happen with default message, but just in case)
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <FaComments className="text-blue-500" size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">AI Assistant Ready</h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          Start a conversation with the AI assistant to refine and improve your test cases.
        </p>
        <div className="flex items-center text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
          <FaMagic className="mr-2" size={12} />
          <span>Ask me to modify, add, or improve test cases</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user" ? "bg-blue-500 ml-2" : "bg-gray-200 mr-2"
                }`}
              >
                {message.sender === "user" ? (
                  <FaUser className="text-white" size={12} />
                ) : (
                  <FaRobot className="text-gray-600" size={12} />
                )}
              </div>
              <div
                className={`p-2 rounded-lg text-sm ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
                onClick={handleMessageClick}
                dangerouslySetInnerHTML={{
                  __html: formatMessageContent(message.content, message.version),
                }}
              />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] flex-row">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                <FaRobot className="text-gray-600" size={12} />
              </div>
              <div className="p-2 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto">
        <div className="flex w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type a message..."
            disabled={loading}
            className="w-[70%] py-2 px-3 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className={`w-[30%] py-2 px-3 rounded-r-md text-sm font-medium flex items-center justify-center ${
              !input.trim() || loading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              <>
                <FaPaperPlane className="mr-1" size={12} /> Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
