"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import HistorySection from "@/components/history-section"
import TestCasePreview from "@/components/test-case-preview"
import AIChatInterface from "@/components/ai-chat-interface"
import { type ExportConfig, defaultExportConfig } from "@/utils/excel-export"
import {
  FaHistory,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa"

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
          type: "Positive Case",
          preconditions: "User has a valid account in the system",
          steps: ["Navigate to the login page", "Enter valid username and password", "Click on the login button"],
          expectedResults: [
            "User should be redirected to the dashboard",
            "User name should be displayed in the header",
          ],
          priority: "High",
        },
        {
          id: "1-2",
          name: "Verify user login with invalid credentials",
          functionalModule: "Authentication",
          type: "Negative Case",
          preconditions: "User has an account in the system",
          steps: ["Navigate to the login page", "Enter invalid username and password", "Click on the login button"],
          expectedResults: ["Error message should be displayed", "User should remain on the login page"],
          priority: "High",
        },
      ],
    },
    aiMessages: [
      {
        id: "1-ai-1",
        content:
          "I've analyzed the login feature requirements and generated test cases focusing on authentication flows. (Version 1)",
        sender: "ai",
        timestamp: new Date(),
        version: 1,
      },
    ],
  },
]

export default function CaseGenerationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get("task")
  const prdId = searchParams.get("prd")

  const [tasks, setTasks] = useState(mockTasks)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(tasks[0]?.id || null)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null)
  const [exportConfig, setExportConfig] = useState<ExportConfig>(defaultExportConfig)
  const [showVersionDropdown, setShowVersionDropdown] = useState(false)
  const [requirementsExpanded, setRequirementsExpanded] = useState(true)
  const [showDraggableOriginal, setShowDraggableOriginal] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Initialize based on URL parameters
  useEffect(() => {
    if (taskId) {
      setSelectedTaskId(taskId)
    } else if (prdId) {
      // If coming from PRD, simulate generating test cases
      setIsGenerating(true)
      setTimeout(() => {
        // Create new task from PRD
        const newTask = {
          id: `task-${Date.now()}`,
          title: `Test Cases from PRD ${prdId}`,
          date: new Date().toISOString().split("T")[0],
          type: "PRD",
          version: 1,
          content: "Generated from existing PRD",
          versionedTestCases: {
            1: [
              {
                id: `tc-${Date.now()}-1`,
                name: "Verify core functionality",
                functionalModule: "General",
                type: "Positive Case",
                preconditions: "System is ready",
                steps: ["Execute main function", "Verify output"],
                expectedResults: ["Function executes successfully"],
                priority: "High",
              },
            ],
          },
          aiMessages: [
            {
              id: `ai-${Date.now()}`,
              content: "I've generated test cases based on the selected PRD.",
              sender: "ai",
              timestamp: new Date(),
              version: 1,
            },
          ],
        }
        setTasks((prev) => [newTask, ...prev])
        setSelectedTaskId(newTask.id)
        setIsGenerating(false)
      }, 2000)
    }
  }, [taskId, prdId])

  // Find the selected task or default to the first one
  const selectedTask = selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : tasks[0]

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

      if (showDeleteConfirmation && !target.closest(".delete-confirmation-dialog")) {
        setShowDeleteConfirmation(null)
      }

      if (showVersionDropdown && !target.closest(".version-dropdown")) {
        setShowVersionDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDeleteConfirmation, showVersionDropdown])

  const handleDeleteTask = (id: string) => {
    console.log("Deleting task:", id)
    setShowDeleteConfirmation(null)

    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)

    if (id === selectedTaskId && updatedTasks.length > 0) {
      setSelectedTaskId(updatedTasks[0].id)
      setSelectedVersion(null)
    }
  }

  const handleVersionSelect = (version: number) => {
    setSelectedVersion(version)
    setShowVersionDropdown(false)
    console.log(`Switching to version ${version} for task ${selectedTaskId}`)
  }

  const handleExportConfigChange = (newConfig: ExportConfig) => {
    setExportConfig(newConfig)
    console.log("Export configuration updated:", newConfig)
  }

  const toggleRequirements = () => {
    setRequirementsExpanded(!requirementsExpanded)
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId)
    setSelectedVersion(null)
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FaFilePdf className="text-red-500" size={12} />
      case "Word":
        return <FaFileWord className="text-blue-500" size={12} />
      default:
        return <FaFileAlt className="text-green-500" size={12} />
    }
  }

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
      {/* History/Tasks Sidebar */}
      {requirementsExpanded ? (
        <div className="col-span-12 md:col-span-3 flex flex-col h-full overflow-auto p-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button
                onClick={toggleRequirements}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Collapse Tasks"
              >
                <FaChevronLeft className="text-gray-500" size={14} />
              </button>
            </div>
            <div className="p-3 flex-1 overflow-auto">
              <HistorySection
                historyItems={tasks}
                selectedTaskId={selectedTaskId}
                onSelectTask={handleTaskSelect}
                onDeleteTask={(id) => setShowDeleteConfirmation(id)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="col-span-12 md:col-span-1 flex flex-col h-full p-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-center">
              <button
                onClick={toggleRequirements}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Expand Tasks"
              >
                <FaChevronRight className="text-gray-500" size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-2">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FaHistory className="text-gray-400" size={16} />
                  </div>
                  <div className="text-xs font-medium text-gray-600 text-center">No Tasks Yet</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskSelect(task.id)}
                      className={`w-full p-2 rounded transition-colors text-left ${
                        selectedTaskId === task.id
                          ? "bg-blue-100 border-2 border-blue-300"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                      title={task.title}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div className="flex items-center justify-center">{getFileIcon(task.type)}</div>
                        <div className="text-xs text-gray-700 text-center leading-tight">
                          {task.title.length > 12 ? `${task.title.substring(0, 12)}...` : task.title}
                        </div>
                        <div className="text-xs text-gray-500">v{task.version}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(task.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated Test Cases Module */}
      <div
        className={`col-span-12 ${
          requirementsExpanded ? "md:col-span-6" : "md:col-span-7"
        } flex flex-col h-full overflow-auto p-3`}
      >
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
      <div
        className={`col-span-12 ${
          requirementsExpanded ? "md:col-span-3" : "md:col-span-4"
        } flex flex-col h-full overflow-auto p-3`}
      >
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

            <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedTask?.title}</h4>
                  <div className="text-sm text-gray-500">
                    Created: {selectedTask?.date ? new Date(selectedTask.date).toLocaleDateString() : "Unknown"}
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedTask?.content || "No content available"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                This is the original content used to generate test cases • Drag the header to move
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full delete-confirmation-dialog">
            <h3 className="text-lg font-medium mb-3">Confirm Deletion</h3>
            <p className="mb-4 text-sm">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(null)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(showDeleteConfirmation)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  )
}
