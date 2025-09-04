"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import { FaClipboardList, FaEye, FaTrash, FaPlus, FaSearch, FaCalendar, FaUser, FaDownload } from "react-icons/fa"

// Mock test case task data
const mockTasks = [
  {
    id: "1",
    title: "User Authentication Test Cases",
    prdTitle: "User Authentication System PRD",
    description: "Comprehensive test cases for login, registration, and password reset functionality",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-22",
    creator: "John Doe",
    testCaseCount: 25,
    tags: ["Authentication", "Security", "Login"],
  },
  {
    id: "2",
    title: "Payment Gateway Test Cases",
    prdTitle: "Payment Gateway Integration PRD",
    description: "Test cases covering multiple payment methods and error scenarios",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-21",
    creator: "Jane Smith",
    testCaseCount: 18,
    tags: ["Payment", "Integration", "API"],
  },
  {
    id: "3",
    title: "Dashboard Analytics Test Cases",
    prdTitle: "Dashboard Analytics PRD",
    description: "Test cases for data visualization, filtering, and export functionality",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-19",
    creator: "Mike Johnson",
    testCaseCount: 32,
    tags: ["Analytics", "Dashboard", "Visualization"],
  },
  {
    id: "4",
    title: "Mobile Push Notifications Test Cases",
    prdTitle: "Mobile App Push Notifications PRD",
    description: "Cross-platform notification testing for iOS and Android",
    createdAt: "2025-01-12",
    updatedAt: "2025-01-16",
    creator: "Sarah Wilson",
    testCaseCount: 15,
    tags: ["Mobile", "Notifications", "Cross-platform"],
  },
]

export default function CaseTaskListPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null)

  // Filter tasks based on search term
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.prdTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    setShowDeleteConfirmation(null)
  }

  return (
    <WorkspaceLayout>
      <div className="col-span-12 flex flex-col h-full p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Case Tasks</h1>
              <p className="text-gray-600 mt-1">Manage your test case generation tasks</p>
            </div>
            <button
              onClick={() => router.push("/homepage")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" size={16} />
              Create New Task
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredTasks.length} of {tasks.length} tasks
              </div>
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <FaClipboardList className="text-green-600 mr-2" size={20} />
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Based on: <span className="font-medium">{task.prdTitle}</span>
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {task.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {task.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{task.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div className="flex items-center">
                      <FaUser className="mr-1" size={10} />
                      <span>Created by {task.creator}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" size={10} />
                      <span>Updated {new Date(task.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClipboardList className="mr-1" size={10} />
                      <span>{task.testCaseCount} test cases</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => router.push(`/case-generation?task=${task.id}`)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <FaEye className="mr-1" size={12} />
                      View
                    </button>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          /* Handle export */
                        }}
                        className="flex items-center text-green-600 hover:text-green-700 text-sm"
                      >
                        <FaDownload className="mr-1" size={12} />
                        Export
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmation(task.id)}
                        className="flex items-center text-red-600 hover:text-red-700 text-sm"
                      >
                        <FaTrash className="mr-1" size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <FaClipboardList className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first test case generation task"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push("/homepage")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Create New Task
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(showDeleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
