"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import { FaFileAlt, FaEye, FaEdit, FaDownload, FaRocket, FaSearch, FaPlus, FaTrash, FaTimes } from "react-icons/fa"

interface PRD {
  id: string
  name: string
  generationTime: string
  updateTime: string
  creator: string
  content: string
}

export default function PRDListPage() {
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedPRD, setSelectedPRD] = useState<PRD | null>(null)

  // Mock PRD data
  const [prds, setPRDs] = useState<PRD[]>([
    {
      id: "1",
      name: "User Authentication System PRD",
      generationTime: "2025-01-15 10:30",
      updateTime: "2025-01-16 14:20",
      creator: "John Doe",
      content: `# User Authentication System PRD

## Overview
This document outlines the requirements for implementing a comprehensive user authentication system.

## Features
1. User Registration
2. Login/Logout
3. Password Reset
4. Two-Factor Authentication
5. Session Management

## Technical Requirements
- Secure password hashing
- JWT token implementation
- Rate limiting for login attempts
- Email verification system`,
    },
    {
      id: "2",
      name: "Payment Gateway Integration PRD",
      generationTime: "2025-01-10 09:15",
      updateTime: "2025-01-12 16:45",
      creator: "Jane Smith",
      content: `# Payment Gateway Integration PRD

## Overview
Integration of secure payment processing capabilities into the platform.

## Supported Payment Methods
- Credit/Debit Cards
- Digital Wallets
- Bank Transfers
- Cryptocurrency

## Security Requirements
- PCI DSS Compliance
- SSL/TLS Encryption
- Fraud Detection
- Transaction Monitoring`,
    },
    {
      id: "3",
      name: "Dashboard Analytics PRD",
      generationTime: "2025-01-05 11:20",
      updateTime: "2025-01-08 13:30",
      creator: "Mike Johnson",
      content: `# Dashboard Analytics PRD

## Overview
Comprehensive analytics dashboard for business intelligence and reporting.

## Key Features
- Real-time data visualization
- Custom report generation
- Data export capabilities
- User behavior tracking
- Performance metrics

## Technical Stack
- React for frontend
- D3.js for visualizations
- REST API for data
- Real-time WebSocket updates`,
    },
  ])

  const filteredPRDs = prds.filter(
    (prd) =>
      prd.name.toLowerCase().includes(searchText.toLowerCase()) ||
      prd.creator.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleViewContent = (prd: PRD) => {
    setSelectedPRD(prd)
    setShowViewModal(true)
  }

  const handleEditContent = (prdId: string) => {
    router.push(`/prd-generation?edit=${prdId}`)
  }

  const handleDownload = (prd: PRD) => {
    // Create a blob with the PRD content
    const blob = new Blob([prd.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create download link
    const link = document.createElement("a")
    link.href = url
    link.download = `${prd.name}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleQuickGenerate = (prdId: string) => {
    // Open case generation page in new window
    window.open(`/case-generation?prd=${prdId}`, "_blank")
  }

  const handleDeletePRD = (prdId: string) => {
    setPRDs(prds.filter((prd) => prd.id !== prdId))
    setShowDeleteConfirm(null)
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
              onClick={() => router.push("/homepage")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" size={14} />
              Create New PRD
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search PRDs..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredPRDs.length} of {prds.length} PRDs
              </div>
            </div>
          </div>

          {/* PRD List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRD Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generation Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPRDs.map((prd) => (
                    <tr key={prd.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaFileAlt className="text-blue-500 mr-3" size={16} />
                          <div className="text-sm font-medium text-gray-900">{prd.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prd.generationTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prd.updateTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prd.creator}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewContent(prd)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                            title="View Content"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            onClick={() => handleEditContent(prd.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                            title="Edit Content"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDownload(prd)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-100"
                            title="Download"
                          >
                            <FaDownload size={14} />
                          </button>
                          <button
                            onClick={() => handleQuickGenerate(prd.id)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-100"
                            title="Quick Case Generation"
                          >
                            <FaRocket size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(prd.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                            title="Delete"
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

            {filteredPRDs.length === 0 && (
              <div className="text-center py-12">
                <FaFileAlt className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PRDs Found</h3>
                <p className="text-gray-500">
                  {searchText ? "Try adjusting your search terms" : "Create your first PRD to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Content Modal */}
      {showViewModal && selectedPRD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{selectedPRD.name}</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              <p>
                Created: {selectedPRD.generationTime} • Updated: {selectedPRD.updateTime} • By: {selectedPRD.creator}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{selectedPRD.content}</pre>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleEditContent(selectedPRD.id)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit PRD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this PRD? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePRD(showDeleteConfirm)}
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
