"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import WorkspaceLayout from "@/components/workspace-layout"
import { FaUpload, FaImage, FaSave, FaArrowLeft, FaRocket, FaSpinner, FaCheckCircle, FaEdit } from "react-icons/fa"

export default function PRDGenerationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prdId = searchParams.get("id")
  const mode = searchParams.get("mode") // 'edit' or 'view'

  const [step, setStep] = useState(1) // 1: input, 2: generating, 3: result
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [textInput, setTextInput] = useState("")
  const [generatedPRD, setGeneratedPRD] = useState("")
  const [prdTitle, setPRDTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Mock existing PRD data for edit/view mode
  const mockPRD = {
    id: "1",
    title: "User Authentication System PRD",
    content: `# User Authentication System PRD

## 1. Overview
This document outlines the requirements for implementing a comprehensive user authentication system that supports multiple authentication methods and provides secure access control.

## 2. Objectives
- Implement secure user registration and login functionality
- Support multi-factor authentication (MFA)
- Provide password reset and account recovery options
- Ensure compliance with security best practices

## 3. Functional Requirements

### 3.1 User Registration
- Users must be able to create accounts using email and password
- Email verification required for account activation
- Password strength validation (minimum 8 characters, mixed case, numbers, special characters)
- Duplicate email prevention

### 3.2 User Login
- Support email/password authentication
- Remember me functionality with secure session management
- Account lockout after failed attempts (3 attempts, 15-minute lockout)
- Login attempt logging for security monitoring

### 3.3 Multi-Factor Authentication
- SMS-based OTP support
- Authenticator app integration (Google Authenticator, Authy)
- Backup codes for account recovery
- Optional MFA enforcement by administrators

### 3.4 Password Management
- Secure password reset via email
- Password change functionality for authenticated users
- Password history to prevent reuse of recent passwords
- Encrypted password storage using bcrypt

## 4. Non-Functional Requirements

### 4.1 Security
- All passwords encrypted using bcrypt with salt
- HTTPS required for all authentication endpoints
- Session tokens with appropriate expiration
- CSRF protection for all forms

### 4.2 Performance
- Authentication response time < 500ms
- Support for 1000+ concurrent users
- Database query optimization for user lookups

### 4.3 Usability
- Responsive design for mobile and desktop
- Clear error messages and validation feedback
- Accessibility compliance (WCAG 2.1 AA)

## 5. Technical Specifications

### 5.1 Database Schema
- Users table with encrypted passwords
- Sessions table for active user sessions
- Authentication logs for security monitoring
- MFA settings and backup codes storage

### 5.2 API Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- POST /api/auth/reset-password - Password reset
- POST /api/auth/verify-mfa - MFA verification

## 6. Success Criteria
- 99.9% uptime for authentication services
- Zero security breaches related to authentication
- User satisfaction score > 4.5/5 for login experience
- Average login time < 3 seconds`,
  }

  useEffect(() => {
    // Load existing PRD data if in edit/view mode
    if (prdId) {
      setPRDTitle(mockPRD.title)
      setGeneratedPRD(mockPRD.content)
      setStep(3)
      setIsEditing(mode === "edit")
    }
  }, [prdId, mode])

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

  const handleGenerate = () => {
    setIsGenerating(true)
    setStep(2)

    // Simulate PRD generation
    setTimeout(() => {
      setGeneratedPRD(`# ${prdTitle || "Generated Product Requirements Document"}

## 1. Overview
This document outlines the requirements for the requested feature based on the provided input and specifications.

## 2. Objectives
- Define clear functional and non-functional requirements
- Establish success criteria and acceptance conditions
- Provide technical specifications for implementation
- Ensure alignment with business goals and user needs

## 3. Functional Requirements

### 3.1 Core Functionality
Based on your input: "${textInput.substring(0, 100)}${textInput.length > 100 ? "..." : ""}"

The system shall provide the following core capabilities:
- Primary feature implementation as described
- User interface components for interaction
- Data processing and storage mechanisms
- Integration with existing systems

### 3.2 User Interface Requirements
- Responsive design supporting desktop and mobile devices
- Intuitive navigation and user experience
- Accessibility compliance (WCAG 2.1 AA standards)
- Consistent visual design language

### 3.3 Data Management
- Secure data storage and retrieval
- Data validation and sanitization
- Backup and recovery procedures
- Data privacy and compliance measures

## 4. Non-Functional Requirements

### 4.1 Performance
- Response time < 2 seconds for standard operations
- Support for concurrent users as per business requirements
- Scalable architecture to handle growth
- Efficient resource utilization

### 4.2 Security
- Authentication and authorization mechanisms
- Data encryption in transit and at rest
- Regular security audits and updates
- Compliance with relevant security standards

### 4.3 Reliability
- 99.9% uptime availability
- Graceful error handling and recovery
- Comprehensive logging and monitoring
- Automated backup procedures

## 5. Technical Specifications

### 5.1 Architecture
- Modular design with clear separation of concerns
- RESTful API design principles
- Database schema optimization
- Caching strategies for performance

### 5.2 Integration Requirements
- Third-party service integrations
- API documentation and versioning
- Error handling and retry mechanisms
- Rate limiting and throttling

## 6. Success Criteria
- All functional requirements implemented and tested
- Performance benchmarks met or exceeded
- Security requirements validated
- User acceptance testing completed successfully
- Documentation and training materials provided

## 7. Implementation Timeline
- Phase 1: Core functionality development
- Phase 2: User interface implementation
- Phase 3: Integration and testing
- Phase 4: Deployment and monitoring

This PRD serves as the foundation for the development process and should be reviewed and approved by all stakeholders before implementation begins.`)

      setIsGenerating(false)
      setStep(3)
    }, 3000)
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Saving PRD:", { title: prdTitle, content: generatedPRD })
    alert("PRD saved successfully!")
  }

  const handleBack = () => {
    if (step === 3 && !prdId) {
      setStep(1)
      setGeneratedPRD("")
      setPRDTitle("")
    } else {
      router.push("/prd-list")
    }
  }

  return (
    <WorkspaceLayout>
      <div className="col-span-12 flex flex-col h-full p-6">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {prdId ? (mode === "edit" ? "Edit PRD" : "View PRD") : "Generate PRD"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {step === 1 && "Provide your requirements and let AI generate a comprehensive PRD"}
                  {step === 2 && "AI is analyzing your input and generating the PRD..."}
                  {step === 3 && "Review and edit your generated PRD"}
                </p>
              </div>
            </div>

            {step === 3 && (
              <div className="flex items-center space-x-3">
                {prdId && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <FaEdit className="mr-2" size={16} />
                    Edit
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaSave className="mr-2" size={16} />
                  Save PRD
                </button>
              </div>
            )}
          </div>

          {/* Step 1: Input */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                {/* PRD Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PRD Title</label>
                  <input
                    type="text"
                    value={prdTitle}
                    onChange={(e) => setPRDTitle(e.target.value)}
                    placeholder="Enter a title for your PRD..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements Description</label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your product requirements, features, user stories, or any specific details you want included in the PRD..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
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
                      Click to upload documents
                    </label>
                    <p className="text-sm text-gray-500 mt-1">DOCX, TXT, PDF files supported</p>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{selectedFiles.length} file(s) selected</p>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleGenerate}
                    disabled={!textInput.trim() && selectedFiles.length === 0 && selectedImages.length === 0}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaRocket className="mr-2" size={16} />
                    Generate PRD
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Generating */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <FaSpinner className="text-blue-600 animate-spin" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your PRD</h3>
                <p className="text-gray-600 mb-6">
                  AI is analyzing your requirements and creating a comprehensive Product Requirements Document...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Success Header */}
              {!prdId && (
                <div className="p-4 bg-green-50 border-b border-green-200 rounded-t-lg">
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-600 mr-2" size={20} />
                    <span className="text-green-800 font-medium">PRD Generated Successfully!</span>
                  </div>
                </div>
              )}

              {/* PRD Title */}
              <div className="p-6 border-b border-gray-200">
                {isEditing ? (
                  <input
                    type="text"
                    value={prdTitle}
                    onChange={(e) => setPRDTitle(e.target.value)}
                    className="w-full text-2xl font-bold text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{prdTitle}</h2>
                )}
              </div>

              {/* PRD Content */}
              <div className="p-6">
                {isEditing ? (
                  <textarea
                    value={generatedPRD}
                    onChange={(e) => setGeneratedPRD(e.target.value)}
                    rows={30}
                    className="w-full font-mono text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                      {generatedPRD}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  )
}
