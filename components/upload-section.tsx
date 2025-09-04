"use client"

import type React from "react"
import { useState } from "react"
import { FaUpload, FaFileAlt, FaTimes } from "react-icons/fa"

interface UploadSectionProps {
  onGenerate: () => void
}

export default function UploadSection({ onGenerate }: UploadSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [textInput, setTextInput] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setSelectedFiles((prev) => [...prev, ...fileArray])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    if (selectedFiles.length > 0 || textInput.trim()) {
      onGenerate()
    }
  }

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FaUpload className="mx-auto text-gray-400 mb-3" size={24} />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or{" "}
          <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
            browse
            <input
              type="file"
              multiple
              accept=".txt,.docx,.pdf"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">Supports TXT, DOCX, PDF files</p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
              <div className="flex items-center">
                <FaFileAlt className="text-blue-500 mr-2" size={14} />
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
              </div>
              <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 ml-2">
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Or enter text directly:</label>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Paste your requirements here..."
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={selectedFiles.length === 0 && !textInput.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Generate Test Cases
      </button>
    </div>
  )
}
