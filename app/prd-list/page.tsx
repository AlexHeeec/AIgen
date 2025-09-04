"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import { FaFileAlt, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaCalendar, FaUser } from "react-icons/fa"

// Mock PRD data
const mockPRDs = [
  {
    id: "1",
    title: "User Authentication System PRD",
    description: "Comprehensive PRD for implementing user authentication with multi-factor authentication support",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-20",
    creator: "John Doe",
    status: "Published",
    tags: ["Authentication", "Security", "Backend"],
  },
  {
    id: "2",
    title: "Payment Gateway Integration PRD",
    description: "PRD for integrating multiple payment gateways including PayPal, Stripe, and Apple Pay",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-18",
    creator: "Jane Smith",
    status: "Draft",
    tags: ["Payment", "Integration", "API"],
  },
  {
    id: "3",
    title: "Dashboard Analytics PRD",
    description: "Real-time analytics dashboard with customizable widgets and reporting features",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-15",
    creator: "Mike Johnson",
    status: "Published",
    tags: ["Analytics", "Dashboard", "Frontend"],
  },
  {
    id: "4",
    title: "Mobile App Push Notifications PRD",
    description: "Cross-platform push notification system for iOS and Android applications",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-12",
    creator: "Sarah Wilson",
    status: "Review",
    tags: ["Mobile", "Notifications", "Cross-platform"],
  },
]

export default function PRDListPage() {
  const router = useRouter()
  const [prds, setPRDs] = useState(mockPRDs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null)

  // Filter PRDs based on search term and status
  const filteredPRDs = prds.filter((prd) => {
    const matchesSearch =
      prd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prd.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "All" || prd.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeletePRD = (id: string) => {
    setPRDs(prds.filter((prd) => prd.id !== id))
    setShowDeleteConfirmation(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Review":
        return "bg-blue-100 text-blue-800"
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
              <h1 className="text-3xl font-bold text-gray-900">PRD Library</h1>
              <p className="text-gray-600 mt-1">Manage your Product Requirements Documents</p>
            </div>
            <button
              onClick={() => router.push("/prd-generation")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" size={16} />
              Create New PRD
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search PRDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* PRD Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPRDs.map((prd) => (
              <div
                key={prd.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <FaFileAlt className="text-blue-600 mr-2" size={20} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prd.status)}`}>
                        {prd.status}
                      </span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{prd.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{prd.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {prd.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {prd.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{prd.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div className="flex items-center">
                      <FaUser className="mr-1" size={10} />
                      <span>Created by {prd.creator}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" size={10} />
                      <span>Updated {new Date(prd.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => router.push(`/prd-generation?id=${prd.id}`)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <FaEye className="mr-1" size={12} />
                      View
                    </button>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => router.push(`/prd-generation?id=${prd.id}&mode=edit`)}
                        className="flex items-center text-gray-600 hover:text-gray-700 text-sm"
                      >
                        <FaEdit className="mr-1" size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmation(prd.id)}
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
          {filteredPRDs.length === 0 && (
            <div className="text-center py-12">
              <FaFileAlt className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PRDs found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first PRD"}
              </p>
              {!searchTerm && statusFilter === "All" && (
                <button
                  onClick={() => router.push("/prd-generation")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create New PRD
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
              Are you sure you want to delete this PRD? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePRD(showDeleteConfirmation)}
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
