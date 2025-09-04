"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import { FaFileAlt, FaClipboardList, FaUpload, FaImage, FaTimes, FaArrowRight } from "react-icons/fa"

export default function HomePage() {
  const router = useRouter()
  const [showPRDModal, setShowPRDModal] = useState(false)
  const [showTestCaseModal, setShowTestCaseModal] = useState(false)
  const [prdModalStep, setPRDModalStep] = useState(1) // 1: upload, 2: next
  const [testCaseOption, setTestCaseOption] = useState<"existing" | "upload" | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [textInput, setTextInput] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  // Mock existing PRDs
  const existingPRDs = [
    { id: "1", name: "User Authentication System PRD", createdAt: "2025-01-15", creator: "John Doe" },
    { id: "2", name: "Payment Gateway Integration PRD", createdAt: "2025-01-10", creator: "Jane Smith" },
    { id: "3", name: "Dashboard Analytics PRD", createdAt: "2025-01-05", creator: "Mike Johnson" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (type === "file") {
        setSelectedFiles(files)
      } else {
        setSelectedImages(files)
      }
    }
  }

  const handlePRDGenerate = () => {
    // Navigate to PRD generation page
    router.push("/prd-generation")
  }

  const handleTestCaseFromExisting = (prdId: string) => {
    // Navigate to case generation page with existing PRD
    router.push(`/case-generation?prd=${prdId}`)
  }

  const handleTestCaseFromUpload = () => {
    // Navigate to case generation page with uploaded content
    router.push("/case-generation")
  }

  return (
    <WorkspaceLayout>
      <div className="col-span-12 flex flex-col items-center justify-center h-full p-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AIGenTest</h1>
            <p className="text-xl text-gray-600">
              Streamline your product development with AI-powered PRD and test case generation
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Generate PRD Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <FaFileAlt className="text-blue-600" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Generate PRD</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create comprehensive Product Requirements Documents with AI assistance. Define features, user stories,
                  and technical specifications efficiently.
                </p>
                <button
                  onClick={() => setShowPRDModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  Start Creating PRD
                  <FaArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>

            {/* Generate Test Case Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <FaClipboardList className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Generate Test Cases</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Transform your requirements into comprehensive test cases automatically. Upload documents or use
                  existing PRDs to generate detailed test scenarios.
                </p>
                <button
                  onClick={() => setShowTestCaseModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                >
                  Start Generating Cases
                  <FaArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose AIGenTest?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Generation</h4>
                <p className="text-gray-600 text-sm">
                  Leverage advanced AI to create comprehensive PRDs and test cases from your requirements
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Multiple Input Formats</h4>
                <p className="text-gray-600 text-sm">
                  Support for DOCX, TXT files, and platform-generated PRDs for maximum flexibility
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Export & Integration</h4>
                <p className="text-gray-600 text-sm">
                  Export your generated content in various formats and integrate with your existing workflow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRD Generation Modal */}
      {showPRDModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Generate PRD</h3>
              <button
                onClick={() => {
                  setShowPRDModal(false)
                  setPRDModalStep(1)
                  setSelectedFiles([])
                  setSelectedImages([])
                  setTextInput("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Upload Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaImage className="mx-auto text-gray-400 mb-2" size={24} />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                    Click to upload images
                  </label>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                </div>
                {selectedImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{selectedImages.length} image(s) selected</p>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Input</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your product requirements, features, or ideas..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaUpload className="mx-auto text-gray-400 mb-2" size={24} />
                  <input
                    type="file"
                    multiple
                    accept=".docx,.txt,.pdf"
                    onChange={(e) => handleFileUpload(e, "file")}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                    Click to upload files
                  </label>
                  <p className="text-sm text-gray-500 mt-1">DOCX, TXT, PDF files supported</p>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{selectedFiles.length} file(s) selected</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowPRDModal(false)
                  setPRDModalStep(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePRDGenerate}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                Next <FaArrowRight className="ml-2" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Case Generation Modal */}
      {showTestCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Generate Test Cases</h3>
              <button
                onClick={() => {
                  setShowTestCaseModal(false)
                  setTestCaseOption(null)
                  setSelectedFiles([])
                  setTextInput("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {!testCaseOption ? (
              <div className="space-y-4">
                <p className="text-gray-600 mb-6">Choose how you want to generate test cases:</p>

                <button
                  onClick={() => setTestCaseOption("existing")}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="font-medium text-gray-900">Choose Existing PRD from Platform</div>
                  <div className="text-sm text-gray-600 mt-1">Select from previously generated PRDs</div>
                </button>

                <button
                  onClick={() => setTestCaseOption("upload")}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left"
                >
                  <div className="font-medium text-gray-900">Upload New PRD</div>
                  <div className="text-sm text-gray-600 mt-1">Upload documents or enter text directly</div>
                </button>
              </div>
            ) : testCaseOption === "existing" ? (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Select Existing PRD</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {existingPRDs.map((prd) => (
                    <div
                      key={prd.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                      onClick={() => handleTestCaseFromExisting(prd.id)}
                    >
                      <div className="font-medium text-gray-900">{prd.name}</div>
                      <div className="text-sm text-gray-600">
                        Created: {prd.createdAt} • By: {prd.creator}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h4 className="font-medium text-gray-900">Upload New PRD</h4>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File to Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaUpload className="mx-auto text-gray-400 mb-2" size={24} />
                    <input
                      type="file"
                      accept=".docx,.txt"
                      onChange={(e) => handleFileUpload(e, "file")}
                      className="hidden"
                      id="prd-file-upload"
                    />
                    <label htmlFor="prd-file-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                      Click to upload file
                    </label>
                    <p className="text-sm text-gray-500 mt-1">DOCX, TXT files supported</p>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{selectedFiles[0].name}</p>
                    </div>
                  )}
                </div>

                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Online Text Input</label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste or type your PRD content here..."
                  />
                </div>

                <button
                  onClick={handleTestCaseFromUpload}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Start Generation
                </button>
              </div>
            )}

            {testCaseOption && (
              <div className="flex justify-start mt-6">
                <button onClick={() => setTestCaseOption(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </WorkspaceLayout>
  )
}
