"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import { FaClipboardList, FaEye, FaTrash, FaSearch, FaFileWord, FaFileAlt } from "react-icons/fa"

interface CaseTask {
  id: string
  taskName: string
  caseCount: number
  generationCount: number
  generationTime: string
  contentSource: "docx" | "txt" | "platform"
}

export default function CaseTaskListPage() {
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Mock case task data
  const [caseTasks, setCaseTasks] = useState<CaseTask[]>([
    {
      id: "1",
      taskName: "User Authentication Test Cases",
      caseCount: 15,
      generationCount: 3,
      generationTime: "2025-01-16 14:30",
      contentSource: "platform",
    },
    {
      id: "2",
      taskName: "Payment Gateway Test Cases",
      caseCount: 22,
      generationCount: 2,
      generationTime: "2025-01-15 10:45",
      contentSource: "docx",
    },
    {
      id: "3",
      taskName: "Dashboard Analytics Test Cases",
      caseCount: 18,
      generationCount: 1,
      generationTime: "2025-01-14 16:20",
      contentSource: "txt",
    },
    {
      id: "4",
      taskName: "Mobile App Login Test Cases",
      caseCount: 12,
      generationCount: 4,
      generationTime: "2025-01-13 09:15",
      contentSource: "platform",
    },
    {
      id: "5",
      taskName: "API Integration Test Cases",
      caseCount: 28,
      generationCount: 2,
      generationTime: "2025-01-12 11:30",
      contentSource: "docx",
    },
  ])

  const filteredTasks = caseTasks.filter((task) => task.taskName.toLowerCase().includes(searchText.toLowerCase()))

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "docx":
        return <FaFileWord className="text-blue-500" size={16} />
      case "txt":
        return <FaFileAlt className="text-green-500" size={16} />
      case "platform":
        return <FaClipboardList className="text-purple-500" size={16} />
      default:
        return <FaFileAlt className="text-gray-500" size={16} />
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "docx":
        return "DOCX File"
      case "txt":
        return "TXT File"
      case "platform":
        return "Platform PRD"
      default:
        return "Unknown"
    }
  }

  const handleViewCases = (taskId: string) => {
    // Open case generation page in new window
    window.open(`/case-generation?task=${taskId}`, "_blank")
  }

  const handleDeleteTask = (taskId: string) => {
    setCaseTasks(caseTasks.filter((task) => task.id !== taskId))
    setShowDeleteConfirm(null)
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
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <FaClipboardList className="mr-2" size={14} />
              Generate New Cases
            </button>
          </div>

          {/* Search and Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{filteredTasks.length}</span> tasks
                </div>
                <div>
                  <span className="font-medium">{filteredTasks.reduce((sum, task) => sum + task.caseCount, 0)}</span>{" "}
                  total cases
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cases
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generation Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaClipboardList className="text-blue-500 mr-3" size={16} />
                          <div className="text-sm font-medium text-gray-900">{task.taskName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {task.caseCount} cases
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {task.generationCount}x
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.generationTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getSourceIcon(task.contentSource)}
                          <span className="ml-2 text-sm text-gray-600">{getSourceLabel(task.contentSource)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewCases(task.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <FaEye className="mr-1" size={12} />
                            View Cases
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(task.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                            title="Delete Task"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <FaClipboardList className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
                <p className="text-gray-500">
                  {searchText ? "Try adjusting your search terms" : "Generate your first test cases to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This will permanently remove all associated test cases and
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(showDeleteConfirm)}
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
