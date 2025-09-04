"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import {
  FaClipboardList,
  FaEye,
  FaTrash,
  FaPlus,
  FaSearch,
  FaCalendar,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaDownload,
} from "react-icons/fa"

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
    status: "Completed",
    testCaseCount: 25,
    priority: "High",
  },
  {
    id: "2",
    title: "Payment Gateway Test Cases",
    prdTitle: "Payment Gateway Integration PRD",
    description: "Test cases covering multiple payment methods and error scenarios",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-21",
    creator: "Jane Smith",
    status: "In Progress",
    testCaseCount: 18,
    priority: "High",
  },
  {
    id: "3",
    title: "Dashboard Analytics Test Cases",
    prdTitle: "Dashboard Analytics PRD",
    description: "Test cases for data visualization, filtering, and export functionality",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-19",
    creator: "Mike Johnson",
    status: "Completed",
    testCaseCount: 32,
    priority: "Medium",
  },
  {
    id: "4",
    title: "Mobile Push Notifications Test Cases",
    prdTitle: "Mobile App Push Notifications PRD",
    description: "Cross-platform notification testing for iOS and Android",
    createdAt: "2025-01-12",
    updatedAt: "2025-01-16",
    creator: "Sarah Wilson",
    status: "Failed",
    testCaseCount: 0,
    priority: "Low",
  },
]

export default function CaseTaskListPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null)

  // Filter tasks based on search term, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.prdTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || task.status === statusFilter
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    setShowDeleteConfirmation(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="text-green-600" size={16} />
      case "In Progress":
        return <FaClock className="text-blue-600" size={16} />
      case "Failed":
        return <FaExclamationCircle className="text-red-600" size={16} />
      default:
        return <FaClock className="text-gray-600" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
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

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Priority:</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center mb-3">
                        <FaClipboardList className="text-blue-600 mr-3" size={20} />
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(task.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Based on: <span className="font-medium">{task.prdTitle}</span>
                      </p>
                      <p className="text-gray-600 text-sm mb-4">{task.description}</p>

                      {/* Meta Info */}
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
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
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 ml-6">
                      {task.status === "Completed" && (
                        <button
                          onClick={() => {
                            /* Handle export */
                          }}
                          className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1 border border-green-300 rounded hover:bg-green-50"
                        >
                          <FaDownload className="mr-1" size={12} />
                          Export
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/case-generation?task=${task.id}`)}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 border border-blue-300 rounded hover:bg-blue-50"
                      >
                        <FaEye className="mr-1" size={12} />
                        View
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmation(task.id)}
                        className="flex items-center text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50"
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
                {searchTerm || statusFilter !== "All" || priorityFilter !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first test case generation task"}
              </p>
              {!searchTerm && statusFilter === "All" && priorityFilter === "All" && (
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
