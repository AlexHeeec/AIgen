"use client"

import { useState, useEffect } from "react"
import WorkspaceLayout from "@/components/workspace-layout"
import UploadSection from "@/components/upload-section"
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
} from "react-icons/fa"

// Mock data structure with version-specific test cases
const mockTasks = [
  {
    id: "1",
    title: "Login Feature Requirements",
    date: "2025-03-20",
    type: "PDF",
    version: 1,
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
  {
    id: "2",
    title: "User Profile Module",
    date: "2025-03-18",
    type: "Text",
    version: 2,
    versionedTestCases: {
      1: [
        {
          id: "2-1-v1",
          name: "Verify user can update profile information",
          functionalModule: "User Management",
          type: "Positive Case",
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Update profile information", "Click save button"],
          expectedResults: ["Success message is displayed", "Profile information is updated"],
          priority: "Medium",
        },
        {
          id: "2-2-v1",
          name: "Verify user can change password",
          functionalModule: "User Management",
          type: "Positive Case",
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Click change password", "Enter current and new password", "Click save"],
          expectedResults: ["Success message is displayed", "User can login with new password"],
          priority: "High",
        },
      ],
      2: [
        {
          id: "2-1-v2",
          name: "Verify user can update profile information",
          functionalModule: "User Management",
          type: "Positive Case",
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Update profile information", "Click save button"],
          expectedResults: ["Success message is displayed", "Profile information is updated"],
          priority: "Medium",
        },
        {
          id: "2-2-v2",
          name: "Verify user can change password",
          functionalModule: "User Management",
          type: "Positive Case",
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Click change password", "Enter current and new password", "Click save"],
          expectedResults: ["Success message is displayed", "User can login with new password"],
          priority: "High",
        },
        {
          id: "2-3-v2",
          name: "Verify validation for required fields",
          functionalModule: "User Management",
          type: "Negative Case",
          preconditions: "User is logged in to the system",
          steps: ["Navigate to profile page", "Clear required fields", "Click save button"],
          expectedResults: ["Validation errors are displayed", "Profile is not updated"],
          priority: "Medium",
        },
      ],
    },
    aiMessages: [
      {
        id: "2-ai-1",
        content:
          "I've analyzed the user profile requirements and generated test cases for profile management functionality. (Version 1)",
        sender: "ai",
        timestamp: new Date(),
        version: 1,
      },
      {
        id: "2-ai-2",
        content: "I've updated the test cases to include validation for all required fields as requested. (Version 2)",
        sender: "ai",
        timestamp: new Date(),
        version: 2,
      },
    ],
  },
  {
    id: "3",
    title: "Payment Gateway Integration",
    date: "2025-03-15",
    type: "Word",
    version: 3,
    versionedTestCases: {
      1: [
        {
          id: "3-1-v1",
          name: "Verify successful payment processing",
          functionalModule: "Payment",
          type: "Positive Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter valid payment details", "Click pay now"],
          expectedResults: ["Payment is processed successfully", "Order confirmation is displayed"],
          priority: "High",
        },
        {
          id: "3-2-v1",
          name: "Verify payment failure handling",
          functionalModule: "Payment",
          type: "Negative Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter invalid payment details", "Click pay now"],
          expectedResults: ["Error message is displayed", "User can retry payment"],
          priority: "High",
        },
      ],
      2: [
        {
          id: "3-1-v2",
          name: "Verify successful payment processing",
          functionalModule: "Payment",
          type: "Positive Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter valid payment details", "Click pay now"],
          expectedResults: ["Payment is processed successfully", "Order confirmation is displayed"],
          priority: "High",
        },
        {
          id: "3-2-v2",
          name: "Verify payment failure handling",
          functionalModule: "Payment",
          type: "Negative Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter invalid payment details", "Click pay now"],
          expectedResults: ["Error message is displayed", "User can retry payment"],
          priority: "High",
        },
        {
          id: "3-3-v2",
          name: "Verify payment timeout handling",
          functionalModule: "Payment",
          type: "Corner Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter valid payment details", "Simulate timeout", "Click pay now"],
          expectedResults: ["Timeout message is displayed", "User can retry payment"],
          priority: "Medium",
        },
      ],
      3: [
        {
          id: "3-1-v3",
          name: "Verify successful payment processing",
          functionalModule: "Payment",
          type: "Positive Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter valid payment details", "Click pay now"],
          expectedResults: ["Payment is processed successfully", "Order confirmation is displayed"],
          priority: "High",
        },
        {
          id: "3-2-v3",
          name: "Verify payment failure handling",
          functionalModule: "Payment",
          type: "Negative Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter invalid payment details", "Click pay now"],
          expectedResults: ["Error message is displayed", "User can retry payment"],
          priority: "High",
        },
        {
          id: "3-3-v3",
          name: "Verify payment timeout handling",
          functionalModule: "Payment",
          type: "Corner Case",
          preconditions: "User has items in cart and is on checkout page",
          steps: ["Select payment method", "Enter valid payment details", "Simulate timeout", "Click pay now"],
          expectedResults: ["Timeout message is displayed", "User can retry payment"],
          priority: "Medium",
        },
        {
          id: "3-4-v3",
          name: "Verify order history updates after payment",
          functionalModule: "Order Management",
          type: "Positive Case",
          preconditions: "User has completed payment for an order",
          steps: ["Navigate to order history", "Find the recent order"],
          expectedResults: ["Order is listed with correct status", "Payment details are correct"],
          priority: "Low",
        },
      ],
    },
    aiMessages: [
      {
        id: "3-ai-1",
        content:
          "I've analyzed the payment gateway requirements and generated test cases for various payment scenarios. (Version 1)",
        sender: "ai",
        timestamp: new Date(),
        version: 1,
      },
      {
        id: "3-ai-2",
        content: "I've added test cases for payment failure scenarios as requested. (Version 2)",
        sender: "ai",
        timestamp: new Date(),
        version: 2,
      },
      {
        id: "3-ai-3",
        content: "I've updated the test cases to include order history verification after payment. (Version 3)",
        sender: "ai",
        timestamp: new Date(),
        version: 3,
      },
    ],
  },
  {
    id: "4",
    title: "Dashboard Analytics",
    date: "2025-03-10",
    type: "Text",
    version: 1,
    versionedTestCases: {
      1: [
        {
          id: "4-1",
          name: "Verify dashboard loads with correct data",
          functionalModule: "Analytics",
          type: "Positive Case",
          preconditions: "User is logged in with admin privileges",
          steps: ["Navigate to dashboard", "Check data visualization components"],
          expectedResults: ["All charts and graphs are displayed", "Data matches expected values"],
          priority: "Medium",
        },
        {
          id: "4-2",
          name: "Verify date range filter functionality",
          functionalModule: "Analytics",
          type: "Positive Case",
          preconditions: "User is logged in with admin privileges",
          steps: ["Navigate to dashboard", "Change date range filter", "Apply filter"],
          expectedResults: ["Dashboard refreshes with new data", "Data matches selected date range"],
          priority: "Medium",
        },
      ],
    },
    aiMessages: [
      {
        id: "4-ai-1",
        content:
          "I've analyzed the dashboard analytics requirements and generated test cases for data visualization and filtering functionality. (Version 1)",
        sender: "ai",
        timestamp: new Date(),
        version: 1,
      },
    ],
  },
]

// Function to add a new task to the list
const addNewTask = (tasks, newTask) => {
  // Add the new task at the beginning of the array
  return [newTask, ...tasks]
}

export default function WorkspacePage() {
  // Initialize with sorted tasks
  const [tasks, setTasks] = useState(() =>
    [...mockTasks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  )

  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || null)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null)
  const [exportConfig, setExportConfig] = useState<ExportConfig>(defaultExportConfig)
  const [showVersionDropdown, setShowVersionDropdown] = useState(false)
  const [requirementsExpanded, setRequirementsExpanded] = useState(true) // Default to expanded

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

      // Check if click is outside of any dialog
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
    // In a real app, you would call your API to delete the task
    console.log("Deleting task:", id)
    setShowDeleteConfirmation(null)

    // Remove the task from the list
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)

    // If the deleted task is the selected one, select the first task
    if (id === selectedTaskId && updatedTasks.length > 0) {
      setSelectedTaskId(updatedTasks[0].id)
      setSelectedVersion(null) // Reset to latest version
    }
  }

  const handleGenerateTestCases = () => {
    // Start loading immediately without confirmation
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      // Create a new task
      const newTask = {
        id: `task-${Date.now()}`,
        title: `New Requirements ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split("T")[0],
        type: Math.random() > 0.5 ? "PDF" : "Text",
        version: 1,
        versionedTestCases: {
          1: [
            {
              id: `tc-${Date.now()}-1`,
              name: "Verify new functionality works correctly",
              functionalModule: "General",
              type: "Positive Case",
              preconditions: "System is in a stable state",
              steps: ["Navigate to the new feature", "Interact with the feature", "Verify the results"],
              expectedResults: ["Feature responds as expected", "Data is processed correctly"],
              priority: "High",
            },
            {
              id: `tc-${Date.now()}-2`,
              name: "Verify error handling in new functionality",
              functionalModule: "General",
              type: "Negative Case",
              preconditions: "System is in a stable state",
              steps: ["Navigate to the new feature", "Provide invalid input", "Observe system response"],
              expectedResults: ["Error message is displayed", "System remains stable"],
              priority: "Medium",
            },
          ],
        },
        aiMessages: [
          {
            id: `ai-${Date.now()}`,
            content: `I've analyzed the new requirements and generated test cases for the functionality. (Version 1)`,
            sender: "ai",
            timestamp: new Date(),
            version: 1,
          },
        ],
      }

      // Add the new task to the beginning of the list
      const updatedTasks = addNewTask(tasks, newTask)
      setTasks(updatedTasks)

      // Select the new task
      setSelectedTaskId(newTask.id)
      setSelectedVersion(null) // Reset to latest version

      setIsGenerating(false)
    }, 3000)
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

  const handleExportRequest = () => {
    // This will trigger the AI assistant to enter export configuration mode
    console.log("Export customization requested")
  }

  const toggleRequirements = () => {
    setRequirementsExpanded(!requirementsExpanded)
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId)
    setSelectedVersion(null) // Reset to latest version when switching tasks
  }

  // Get icon for file type
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

  return (
    <WorkspaceLayout>
      {/* Requirements Module - Collapsible */}
      {requirementsExpanded ? (
        <div className="col-span-12 md:col-span-3 flex flex-col h-full overflow-auto p-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">Requirements</h2>
              <button
                onClick={toggleRequirements}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Collapse Requirements"
              >
                <FaChevronLeft className="text-gray-500" size={14} />
              </button>
            </div>
            <div className="p-3 flex-1 overflow-auto">
              <UploadSection onGenerate={handleGenerateTestCases} />
              <div className="mt-5">
                <h3 className="text-base font-medium mb-2">History</h3>
                <HistorySection
                  historyItems={tasks}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={handleTaskSelect}
                  onDeleteTask={(id) => setShowDeleteConfirmation(id)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Requirements - Vertical Sidebar with History */
        <div className="col-span-12 md:col-span-1 flex flex-col h-full p-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header with expand button */}
            <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-center">
              <button
                onClick={toggleRequirements}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Expand Requirements"
              >
                <FaChevronRight className="text-gray-500" size={14} />
              </button>
            </div>

            {/* Compact History List */}
            <div className="flex-1 overflow-auto p-2">
              {tasks.length === 0 ? (
                /* Empty state for collapsed history */
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FaHistory className="text-gray-400" size={16} />
                  </div>
                  <div className="text-xs font-medium text-gray-600 text-center">No History Yet</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* History items */}
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
                        {/* File type icon */}
                        <div className="flex items-center justify-center">{getFileIcon(task.type)}</div>

                        {/* Abbreviated title */}
                        <div className="text-xs text-gray-700 text-center leading-tight">
                          {task.title.length > 12 ? `${task.title.substring(0, 12)}...` : task.title}
                        </div>

                        {/* Version indicator */}
                        <div className="text-xs text-gray-500">v{task.version}</div>

                        {/* Date */}
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

      {/* Generated Test Cases Module - Responsive width */}
      <div
        className={`col-span-12 ${
          requirementsExpanded ? "md:col-span-6" : "md:col-span-7"
        } flex flex-col h-full overflow-auto p-3`}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated Test Cases</h2>
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
                onExportRequest={handleExportRequest}
                exportConfig={exportConfig}
                selectedTask={selectedTask}
              />
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Module - Responsive width */}
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
