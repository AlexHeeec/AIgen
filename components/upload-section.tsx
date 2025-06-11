"use client"

import type React from "react"

import { useState, useRef } from "react"
import { TextArea } from "@/components/ui/input"

interface UploadSectionProps {
  onGenerate: () => void
}

export default function UploadSection({ onGenerate }: UploadSectionProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [files, setFiles] = useState<File[]>([])
  const [textInput, setTextInput] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter((file) => {
        const isPDF = file.type === "application/pdf"
        const isWord =
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        return isPDF || isWord
      })

      if (validFiles.length !== selectedFiles.length) {
        alert("You can only upload PDF or Word files!")
      }

      setFiles(validFiles)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first.")
      return
    }

    setLoading(true)
    try {
      // In a real app, you would upload the files to your server here
      console.log("Uploading files:", files)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // No confirmation popup, just reset the files
      setFiles([])

      // Trigger the generation process immediately
      onGenerate()
    } catch (error) {
      alert("Upload failed. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      alert("Please enter some text first.")
      return
    }

    setLoading(true)
    try {
      // In a real app, you would send the text to your server here
      console.log("Submitting text:", textInput)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // No confirmation popup, just reset the text
      setTextInput("")

      // Trigger the generation process immediately
      onGenerate()
    } catch (error) {
      alert("Submission failed. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Navigation tabs */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-2 w-full gap-0 rounded-md overflow-hidden border border-gray-200">
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === "upload" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Files
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === "text" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Text
          </button>
        </div>
      </div>

      {/* Removed the two HTML buttons that were here */}

      {activeTab === "upload" ? (
        <div>
          <div className="mb-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Custom upload button */}
            <button
              onClick={handleUploadButtonClick}
              className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Upload
            </button>
          </div>
          <div className="text-xs text-gray-500 mb-3">Supported formats: PDF, Word (.doc, .docx)</div>
          <div className="mb-4">
            {files.length > 0 && (
              <ul className="mt-2 divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-2 flex items-center">
                    <span className="text-sm text-gray-800 truncate">{file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : files.length === 0
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Test Cases"
            )}
          </button>
        </div>
      ) : (
        <div>
          <TextArea
            rows={6}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste or type your requirements here..."
            className="mb-4 text-sm"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || loading}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : !textInput.trim()
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Test Cases"
            )}
          </button>
        </div>
      )}
    </div>
  )
}
