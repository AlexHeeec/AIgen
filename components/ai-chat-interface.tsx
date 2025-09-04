"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa"
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
  initialMessages,
  onVersionSelect,
  onExportConfigChange,
  exportConfig,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("export") || input.includes("download")) {
      return "I can help you export the test cases. You can customize the export format, include/exclude specific columns, and choose the file format. Would you like me to show you the export options?"
    }

    if (input.includes("version") || input.includes("update")) {
      return "I can help you create a new version of the test cases with updated requirements. Would you like me to generate an updated version based on new specifications?"
    }

    if (input.includes("add") || input.includes("create")) {
      return "I can help you add new test cases. You can either describe the functionality you want to test, and I'll generate appropriate test cases, or you can manually add them using the Add button in the test cases table."
    }

    if (input.includes("priority") || input.includes("important")) {
      return "Test case priorities help organize testing efforts. High priority cases should be tested first, Medium priority for standard functionality, and Low priority for edge cases. Would you like me to help you adjust the priorities?"
    }

    return "I'm here to help you with test case generation, management, and export. You can ask me about creating new test cases, updating existing ones, organizing by priority, or exporting your test suite. What would you like to work on?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaRobot className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Assistant Ready</h3>
            <p className="text-gray-600 text-sm">Ask me about test cases, export options, or generating new versions</p>
          </div>
        </div>

        <div className="border-t border-gray-200 p-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about test cases..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === "user" ? "bg-blue-600 ml-2" : "bg-gray-200 mr-2"
                }`}
              >
                {message.sender === "user" ? (
                  <FaUser className="text-white" size={12} />
                ) : (
                  <FaRobot className="text-gray-600" size={12} />
                )}
              </div>
              <div
                className={`px-3 py-2 rounded-lg ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <FaRobot className="text-gray-600" size={12} />
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about test cases..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
