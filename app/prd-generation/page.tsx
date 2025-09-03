"use client"
import { useState, useEffect } from "react"
import WorkspaceLayout from "@/components/workspace-layout"
import AIChatInterface from "@/components/ai-chat-interface"
import { type ExportConfig, defaultExportConfig } from "@/utils/excel-export"
import { FaEdit, FaSave, FaTimes, FaFileAlt, FaDownload } from "react-icons/fa"

export default function PRDGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [prdContent, setPRDContent] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [exportConfig, setExportConfig] = useState<ExportConfig>(defaultExportConfig)

  // Mock AI messages for PRD generation
  const [aiMessages, setAiMessages] = useState([
    {
      id: "prd-ai-1",
      content: "I'm analyzing your requirements and generating a comprehensive PRD. This may take a few moments...",
      sender: "ai",
      timestamp: new Date(),
      version: 1,
    },
  ])

  // Simulate PRD generation
  useEffect(() => {
    const timer = setTimeout(() => {
      const generatedPRD = `# Product Requirements Document
## E-commerce Mobile Application

### 1. Overview
This document outlines the requirements for developing a comprehensive e-commerce mobile application that provides users with a seamless shopping experience.

### 2. Objectives
- Create an intuitive and user-friendly mobile shopping platform
- Implement secure payment processing
- Provide personalized product recommendations
- Enable efficient order management and tracking

### 3. Target Audience
- Primary: Mobile-first shoppers aged 18-45
- Secondary: Existing web platform users transitioning to mobile
- Tertiary: New customers seeking convenient shopping solutions

### 4. Core Features

#### 4.1 User Authentication
- Email/phone number registration
- Social media login integration (Google, Facebook, Apple)
- Two-factor authentication for enhanced security
- Password reset functionality

#### 4.2 Product Catalog
- Hierarchical category navigation
- Advanced search with filters
- Product comparison functionality
- High-quality image galleries with zoom
- Product reviews and ratings system

#### 4.3 Shopping Cart & Checkout
- Persistent shopping cart across sessions
- Guest checkout option
- Multiple payment methods (credit cards, digital wallets, BNPL)
- Address book management
- Order summary and confirmation

#### 4.4 User Profile Management
- Personal information management
- Order history and tracking
- Wishlist functionality
- Notification preferences
- Account settings

#### 4.5 Personalization
- AI-powered product recommendations
- Recently viewed items
- Personalized homepage content
- Targeted promotions and offers

### 5. Technical Requirements

#### 5.1 Platform Support
- iOS 14.0+ and Android 8.0+
- Responsive design for various screen sizes
- Offline functionality for basic browsing

#### 5.2 Performance
- App launch time < 3 seconds
- Page load time < 2 seconds
- 99.9% uptime availability
- Support for 10,000+ concurrent users

#### 5.3 Security
- End-to-end encryption for sensitive data
- PCI DSS compliance for payment processing
- Regular security audits and penetration testing
- GDPR and CCPA compliance

#### 5.4 Integration
- Payment gateway integration (Stripe, PayPal)
- Shipping provider APIs
- Analytics and tracking (Google Analytics, Firebase)
- Push notification services
- Customer support chat integration

### 6. User Experience Requirements

#### 6.1 Design Principles
- Minimalist and clean interface
- Consistent visual hierarchy
- Accessibility compliance (WCAG 2.1 AA)
- Dark mode support

#### 6.2 Navigation
- Bottom tab navigation for main sections
- Breadcrumb navigation for deep pages
- Quick access to search and cart
- Intuitive back navigation

#### 6.3 Performance Optimization
- Image lazy loading
- Caching strategies for frequently accessed data
- Progressive loading for large catalogs
- Optimized for low-bandwidth connections

### 7. Business Requirements

#### 7.1 Analytics and Reporting
- User behavior tracking
- Conversion funnel analysis
- Revenue and sales reporting
- Customer acquisition metrics

#### 7.2 Marketing Features
- Push notification campaigns
- In-app promotional banners
- Referral program integration
- Social sharing capabilities

#### 7.3 Customer Support
- In-app chat support
- FAQ section
- Return and refund process
- Order issue reporting

### 8. Success Metrics
- User acquisition: 100K downloads in first 6 months
- User retention: 60% monthly active users
- Conversion rate: 3.5% minimum
- Average order value: $75+
- Customer satisfaction: 4.5+ app store rating

### 9. Timeline and Milestones
- Phase 1 (Months 1-3): Core functionality development
- Phase 2 (Months 4-5): Advanced features and integrations
- Phase 3 (Month 6): Testing, optimization, and launch
- Phase 4 (Ongoing): Post-launch support and iterations

### 10. Risk Assessment
- Technical risks: Third-party API dependencies
- Business risks: Market competition and user adoption
- Mitigation strategies: Comprehensive testing and phased rollout

This PRD serves as the foundation for the development team to create a world-class e-commerce mobile application that meets user needs and business objectives.`

      setPRDContent(generatedPRD)
      setEditedContent(generatedPRD)
      setIsGenerating(false)

      // Add completion message
      setAiMessages((prev) => [
        ...prev,
        {
          id: "prd-ai-2",
          content:
            "I've successfully generated a comprehensive PRD for your e-commerce mobile application. The document includes all essential sections from overview to technical requirements. You can now review and edit the content as needed. (Version 1)",
          sender: "ai",
          timestamp: new Date(),
          version: 1,
        },
      ])
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    setPRDContent(editedContent)
    setIsEditing(false)

    // Add AI message about saving
    setAiMessages((prev) => [
      ...prev,
      {
        id: `prd-ai-${Date.now()}`,
        content: "Your PRD has been saved successfully. All changes have been preserved.",
        sender: "ai",
        timestamp: new Date(),
        version: 1,
      },
    ])
  }

  const handleCancel = () => {
    setEditedContent(prdContent)
    setIsEditing(false)
  }

  const handleDownload = () => {
    const blob = new Blob([prdContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Product_Requirements_Document.docx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleVersionSelect = (version: number) => {
    console.log(`Switching to version ${version}`)
  }

  const handleExportConfigChange = (newConfig: ExportConfig) => {
    setExportConfig(newConfig)
  }

  return (
    <WorkspaceLayout>
      {/* Generated PRD Module */}
      <div className="col-span-12 md:col-span-8 flex flex-col h-full overflow-auto p-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaFileAlt className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold">Generated PRD</h2>
            </div>
            <div className="flex items-center space-x-2">
              {!isGenerating && (
                <>
                  <button
                    onClick={handleDownload}
                    className="flex items-center text-gray-600 hover:text-blue-600 px-2 py-1 rounded border border-gray-200 hover:border-blue-300 text-sm"
                  >
                    <FaDownload className="mr-1" size={12} />
                    Download
                  </button>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        <FaSave className="mr-1" size={12} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center text-gray-600 hover:text-red-600 px-2 py-1 rounded text-sm"
                      >
                        <FaTimes className="mr-1" size={12} />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-gray-600 hover:text-blue-600 px-2 py-1 rounded border border-gray-200 hover:border-blue-300 text-sm"
                    >
                      <FaEdit className="mr-1" size={12} />
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="p-3 flex-1 overflow-auto">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-lg text-gray-600 mb-2">Generating PRD...</p>
                <p className="text-sm text-gray-500">Analyzing requirements and creating comprehensive documentation</p>
              </div>
            ) : (
              <div className="h-full">
                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                    placeholder="Edit your PRD content here..."
                  />
                ) : (
                  <div className="h-full overflow-auto bg-gray-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                      {prdContent}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Module */}
      <div className="col-span-12 md:col-span-4 flex flex-col h-full overflow-auto p-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <div className="p-3 flex-1 overflow-auto flex flex-col">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                <p className="mt-3 text-sm text-gray-600">AI is generating your PRD...</p>
              </div>
            ) : (
              <AIChatInterface
                initialMessages={aiMessages}
                onVersionSelect={handleVersionSelect}
                onExportConfigChange={handleExportConfigChange}
                exportConfig={exportConfig}
              />
            )}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
