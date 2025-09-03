"use client"

import type React from "react"
import { useState, useEffect } from "react"
import WorkspaceLayout from "@/components/workspace-layout"
import TestCasePreview from "@/components/test-case-preview"
import AIChatInterface from "@/components/ai-chat-interface"
import { type ExportConfig, defaultExportConfig } from "@/utils/excel-export"
import { FaHistory, FaChevronDown, FaFileAlt, FaTimes } from "react-icons/fa"

// Mock data structure with version-specific test cases
const mockTasks = [
  {
    id: "1",
    title: "Login Feature Requirements",
    date: "2025-03-20",
    type: "PDF",
    version: 1,
    content: `User Authentication System Requirements

1. Login Functionality
   - Users must be able to log in using email and password
   - System should validate credentials against the database
   - Invalid login attempts should display appropriate error messages
   - After 3 failed attempts, account should be temporarily locked for 15 minutes

2. Password Requirements
   - Minimum 8 characters
   - Must contain at least one uppercase letter, one lowercase letter, and one number
   - Special characters are optional but recommended

3. Session Management
   - User sessions should expire after 30 minutes of inactivity
   - Users should be able to log out manually
   - System should remember login state for "Remember Me" option (up to 30 days)

4. Security Features
   - All passwords must be encrypted using bcrypt
   - Login attempts should be logged for security monitoring
   - Two-factor authentication should be supported (optional)

5. User Interface
   - Login form should be responsive and work on all devices
   - Clear error messages for validation failures
   - Loading indicators during authentication process`,
    versionedTestCases: {
      1: [
        {
          id: "1-1",
          name: "Verify user login with valid credentials",
          functionalModule: "Authentication",
          type: "Positive Case" as const,
          preconditions: "User has a valid account in the system",
          steps: ["Navigate to the login page", "Enter valid username and password", "Click on the login button"],
          expectedResults: [
            "User should be redirected to the dashboard",
            "User name should be displayed in the header",
          ],
          priority: "High" as const,
        },
        {
          id: "1-2",
          name: "Verify user login with invalid credentials",
          functionalModule: "Authentication",
          type: "Negative Case" as const,
          preconditions: "User has an account in the system",
          steps: ["Navigate to the login page", "Enter invalid username and password", "Click on the login button"],
          expectedResults: ["Error message should be displayed", "User should remain on the login page"],
          priority: "High" as const,
        },
        {
          id: "1-3",
          name: "Verify account lockout after failed attempts",
          functionalModule: "Authentication",
          type: "Corner Case" as const,
          preconditions: "User has an account in the system",
          steps: ["Navigate to the login page", "Enter invalid credentials 3 times", "Try to login again"],
          expectedResults: ["Account should be locked", "Lockout message should be displayed"],
          priority: "Medium" as const,
        },
      ],
    },
    aiMessages: [
      {
        id: "1-ai-1",
        content:
          "I've analyzed the login feature requirements and generated test cases focusing on authentication flows. (Version 1)",
        sender: "ai" as const,
        timestamp: new Date(),
        version: 1,
      },
    ],
  },
  {
    id: "2",
    title: "User Profile Module",
    date: "2025-03-18",
    type: "Text",
    version: 2,
    content: `User Profile Management System

Overview:
The user profile module allows users to view and update their personal information, manage account settings, and customize their experience.

Core Features:

1. Profile Information Management
   - Users can view their current profile information
   - Users can edit basic information: name, email, phone number, address
   - Profile picture upload and management
   - Bio/description field (optional, max 500 characters)

2. Account Settings
   - Change password functionality
   - Email notification preferences
   - Privacy settings (public/private profile)
   - Account deactivation option

3. Validation Rules
   - Email must be unique and valid format
   - Phone number must follow international format
   - Name fields are required and must be at least 2 characters
   - Password changes require current password verification

4. Security Features
   - All changes require password confirmation for sensitive data
   - Email verification for email address changes
   - Activity log for profile changes
   - Data encryption for sensitive information

5. User Experience
   - Real-time validation feedback
   - Auto-save for non-critical changes
   - Confirmation dialogs for important changes
   - Mobile-responsive design`,
    versionedTestCases: {
      1: [
        {
          id: "2-1-v1",
          name: "Verify user can update profile information",
          functionalModule: "User Management",
          type: "Positive Case" as const,
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Update profile information", "Click save button"],
          expectedResults: ["Success message is displayed", "Profile information is updated"],
          priority: "Medium" as const,
        },
      ],
      2: [
        {
          id: "2-1-v2",
          name: "Verify user can update profile information",
          functionalModule: "User Management",
          type: "Positive Case" as const,
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Update profile information", "Click save button"],
          expectedResults: ["Success message is displayed", "Profile information is updated"],
          priority: "Medium" as const,
        },
        {
          id: "2-2-v2",
          name: "Verify user can change password",
          functionalModule: "User Management",
          type: "Positive Case" as const,
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Click change password", "Enter current and new password", "Click save"],
          expectedResults: ["Success message is displayed", "User can login with new password"],
          priority: "High" as const,
        },
        {
          id: "2-3-v2",
          name: "Verify validation for required fields",
          functionalModule: "User Management",
          type: "Negative Case" as const,
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Clear required fields", "Click save button"],
          expectedResults: ["Validation errors are displayed", "Profile is not updated"],
          priority: "Medium" as const,
        },
      ],
    },
    aiMessages: [
      {
        id: "2-ai-1",
        content:
          "I've analyzed the user profile requirements and generated test cases for profile management functionality. (Version 1)",
        sender: "ai" as const,
        timestamp: new Date(),
        version: 1,
      },
      {
        id: "2-ai-2",
        content: "I've updated the test cases to include validation for all required fields as requested. (Version 2)",
        sender: "ai" as const,
        timestamp: new Date(),
        version: 2,
      },
    ],
  },
]

export default function CaseGenerationPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(mockTasks[0]?.id || null)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [exportConfig, setExportConfig] = useState<ExportConfig>(defaultExportConfig)
  const [showVersionDropdown, setShowVersionDropdown] = useState(false)
  const [showDraggableOriginal, setShowDraggableOriginal] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Find the selected task or default to the first one
  const selectedTask = selectedTaskId ? mockTasks.find((task) => task.id === selectedTaskId) : mockTasks[0]

  // Get the version to display (selected version or latest)
  const versionToDisplay = selectedVersion || selectedTask?.version || 1

  // Get available versions for the selected task
  const availableVersions = selectedTask ? Array.from({ length: selectedTask.version }, (_, i) => i + 1) : [1]

  // Get test cases for the current version
  const currentVersionTestCases = selectedTask?.versionedTestCases[versionToDisplay] || []

  // Handle click outside for popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (showVersionDropdown && !target.closest(".version-dropdown")) {
        setShowVersionDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showVersionDropdown])

  const handleVersionSelect = (version: number) => {
    setSelectedVersion(version)
    setShowVersionDropdown(false)
    console.log(`Switching to version ${version} for task ${selectedTaskId}`)
  }

  const handleExportConfigChange = (newConfig: ExportConfig) => {
    setExportConfig(newConfig)
    console.log("Export configuration updated:", newConfig)
  }

  const handleExportRequest = () => {
    console.log("Export customization requested")
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = (e.target as HTMLElement).closest(".draggable-dialog")?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setDragPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <WorkspaceLayout>
      {/* Generated Test Cases Module - Expanded width (no Requirements module) */}
      <div className="col-span-12 md:col-span-8 flex flex-col h-full overflow-auto p-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold">Generated Test Cases</h2>
              {selectedTask && (
                <button
                  onClick={() => setShowDraggableOriginal(true)}
                  className="flex items-center text-gray-600 hover:text-blue-600 px-2 py-1 rounded border border-gray-200 hover:border-blue-300 text-sm"
                >
                  <FaFileAlt className="mr-1" size={12} />
                  <span>View Original</span>
                </button>
              )}
            </div>
            <div className="relative version-dropdown">
              <button
                onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                className="flex items-center text-gray-500 hover:text-blue-600 px-2 py-1 rounded border border-gray-200 hover:border-blue-300 text-sm"
              >
                <FaHistory className="mr-1" size={14} />
                <span>Version: {versionToDisplay}</span>
                <FaChevronDown className="ml-1" size={12} />
              </button>

              {showVersionDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                    Select Version
                  </div>
                  {availableVersions.map((v) => (
                    <button
                      key={v}
                      onClick={() => handleVersionSelect(v)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        v === versionToDisplay
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Version {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-3 flex-1 overflow-auto">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                <p className="mt-3 text-sm text-gray-600">Generating test cases...</p>
              </div>
            ) : (
              <TestCasePreview
                testCases={currentVersionTestCases}
                version={versionToDisplay}
                availableVersions={availableVersions}
                onVersionSelect={handleVersionSelect}
                taskTitle={selectedTask?.title || ""}
                exportConfig={exportConfig}
                selectedTask={selectedTask}
              />
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Module */}
      <div className="col-span-12 md:col-span-4 flex flex-col h-full overflow-auto p-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <div className="p-3 flex-1 overflow-auto flex flex-col">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                <p className="mt-3 text-sm text-gray-600">AI is analyzing requirements...</p>
              </div>
            ) : (
              <AIChatInterface
                initialMessages={selectedTask?.aiMessages || []}
                onVersionSelect={handleVersionSelect}
                onExportConfigChange={handleExportConfigChange}
                exportConfig={exportConfig}
              />
            )}
          </div>
        </div>
      </div>

      {/* Draggable Original Content Dialog */}
      {showDraggableOriginal && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="draggable-dialog absolute bg-white rounded-lg shadow-2xl border border-gray-300 w-[600px] max-h-[80vh] overflow-hidden pointer-events-auto"
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              cursor: isDragging ? "grabbing" : "default",
            }}
          >
            {/* Draggable Header */}
            <div
              className="bg-gray-100 px-4 py-3 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaFileAlt className="text-blue-600" size={16} />
                  <h3 className="font-medium text-gray-900">Original Requirements</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDraggableOriginal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
              <div className="space-y-4">
                {/* Task Title */}
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedTask?.title}</h4>
                  <div className="text-sm text-gray-500">
                    Created: {selectedTask?.date ? new Date(selectedTask.date).toLocaleDateString() : "Unknown"}
                  </div>
                </div>

                {/* Original Content */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedTask?.content || "No content available"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                This is the original content used to generate test cases • Drag the header to move
              </div>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  )
}
