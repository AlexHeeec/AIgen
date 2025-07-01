"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaClipboardList,
  FaRocket,
  FaPlus,
  FaCheck,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input, TextArea } from "@/components/ui/input"
import { exportTestCasesToExcel, type ExportConfig, defaultExportConfig } from "@/utils/excel-export"
import { getFileIcon } from "@/utils/file-icon"

interface TestCase {
  id: string
  name: string
  functionalModule: string
  type: "Positive Case" | "Negative Case" | "Corner Case"
  preconditions: string
  steps: string[]
  expectedResults: string[]
  priority: "High" | "Medium" | "Low"
}

interface TestCasePreviewProps {
  testCases: TestCase[]
  version: number
  availableVersions: number[]
  onVersionSelect: (version: number) => void
  taskTitle: string
  exportConfig?: ExportConfig
  selectedTask?: any
}

interface InlineEditState {
  testCaseId: string
  field: string
  value: string
  originalValue: string
}

interface NewTestCase {
  name: string
  functionalModule: string
  type: "Positive Case" | "Negative Case" | "Corner Case"
  preconditions: string
  steps: string[]
  expectedResults: string[]
  priority: "High" | "Medium" | "Low"
}

export default function TestCasePreview({
  testCases,
  version,
  availableVersions,
  onVersionSelect,
  taskTitle,
  exportConfig = defaultExportConfig,
  selectedTask,
}: TestCasePreviewProps) {
  const [searchText, setSearchText] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTestCase, setNewTestCase] = useState<NewTestCase>({
    name: "",
    functionalModule: "",
    type: "Positive Case",
    preconditions: "",
    steps: [""],
    expectedResults: [""],
    priority: "Medium",
  })
  const [showDraggableOriginal, setShowDraggableOriginal] = useState(false)

  const [showDraggableSource, setShowDraggableSource] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Filter test cases based on search text, priority filter, and type filter
  const filteredTestCases = useMemo(() => {
    return testCases.filter((testCase) => {
      const matchesSearch = testCase.name.toLowerCase().includes(searchText.toLowerCase())
      const matchesPriority = priorityFilter ? testCase.priority === priorityFilter : true
      const matchesType = typeFilter ? testCase.type === typeFilter : true
      return matchesSearch && matchesPriority && matchesType
    })
  }, [testCases, searchText, priorityFilter, typeFilter])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Positive Case":
        return "bg-green-100 text-green-800"
      case "Negative Case":
        return "bg-red-100 text-red-800"
      case "Corner Case":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEditTestCase = (testCase: TestCase) => {
    setEditingTestCase({ ...testCase })
  }

  const handleSaveTestCase = () => {
    if (!editingTestCase) return

    // In a real app, you would call your API to update the test case
    console.log("Saving test case:", editingTestCase)
    console.log("For version:", version)

    setEditingTestCase(null)
    showSuccessMessage()
  }

  const handleDeleteTestCase = (id: string) => {
    // In a real app, you would call your API to delete the test case
    console.log("Deleting test case:", id)
    console.log("From version:", version)

    setDeleteConfirmation(null)
  }

  const handleExport = () => {
    setExporting(true)

    // Use setTimeout to prevent UI freezing
    setTimeout(() => {
      try {
        exportTestCasesToExcel(testCases, taskTitle, exportConfig)
      } catch (error) {
        console.error("Export error:", error)
      } finally {
        setExporting(false)
      }
    }, 100)
  }

  const handleInlineEdit = (testCaseId: string, field: string, currentValue: string) => {
    setInlineEdit({
      testCaseId,
      field,
      value: currentValue,
      originalValue: currentValue,
    })
  }

  const handleInlineEditSave = () => {
    if (!inlineEdit) return

    // Check if value is empty
    if (!inlineEdit.value.trim()) {
      // Keep the edit state but don't save
      return
    }

    // Handle array fields (steps and expectedResults)
    if (inlineEdit.field === "steps" || inlineEdit.field === "expectedResults") {
      const arrayValue = inlineEdit.value.split("\n").filter((item) => item.trim())
      console.log("Updating field:", inlineEdit.field, "for test case:", inlineEdit.testCaseId, "to:", arrayValue)
    } else {
      console.log("Updating field:", inlineEdit.field, "for test case:", inlineEdit.testCaseId, "to:", inlineEdit.value)
    }

    setInlineEdit(null)
    showSuccessMessage()
  }

  const handleInlineEditCancel = () => {
    setInlineEdit(null)
  }

  const showSuccessMessage = () => {
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 2000)
  }

  const handleAddTestCase = () => {
    // Validate required fields
    if (!newTestCase.name.trim() || !newTestCase.functionalModule.trim()) {
      return
    }

    // Filter out empty steps and expected results
    const filteredSteps = newTestCase.steps.filter((step) => step.trim())
    const filteredResults = newTestCase.expectedResults.filter((result) => result.trim())

    if (filteredSteps.length === 0 || filteredResults.length === 0) {
      return
    }

    // In a real app, you would call your API to add the test case
    const testCaseToAdd = {
      ...newTestCase,
      id: `tc-${Date.now()}`,
      steps: filteredSteps,
      expectedResults: filteredResults,
    }

    console.log("Adding new test case:", testCaseToAdd)

    // Reset form
    setNewTestCase({
      name: "",
      functionalModule: "",
      type: "Positive Case",
      preconditions: "",
      steps: [""],
      expectedResults: [""],
      priority: "Medium",
    })

    setShowAddDialog(false)
    showSuccessMessage()
  }

  // Format list items with numbers for display
  const formatListWithNumbers = (items: string[] | string): string => {
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return "None"
    }

    if (typeof items === "string") {
      return items
    }

    return items.map((item, index) => `${index + 1}. ${item}`).join("\n")
  }

  // Render inline editable cell
  const renderEditableCell = (testCase: TestCase, field: string, value: string, className = "") => {
    const isEditing = inlineEdit?.testCaseId === testCase.id && inlineEdit?.field === field
    const isEmpty = !value || value.trim() === ""

    if (isEditing) {
      return (
        <div className="relative">
          <input
            type="text"
            value={inlineEdit.value}
            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
            onBlur={handleInlineEditSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInlineEditSave()
              } else if (e.key === "Escape") {
                handleInlineEditCancel()
              }
            }}
            className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !inlineEdit.value.trim() ? "border-red-500 bg-red-50" : "border-blue-500"
            }`}
            autoFocus
          />
        </div>
      )
    }

    return (
      <div
        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors ${className}`}
        onClick={() => handleInlineEdit(testCase.id, field, value)}
        title="Click to edit"
      >
        {value || "Click to add"}
      </div>
    )
  }

  // Render inline editable select cell for Type and Priority
  const renderEditableSelectCell = (
    testCase: TestCase,
    field: string,
    value: string,
    options: string[],
    className = "",
  ) => {
    const isEditing = inlineEdit?.testCaseId === testCase.id && inlineEdit?.field === field

    if (isEditing) {
      return (
        <div className="relative">
          <select
            value={inlineEdit.value}
            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
            onBlur={handleInlineEditSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInlineEditSave()
              } else if (e.key === "Escape") {
                handleInlineEditCancel()
              }
            }}
            className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )
    }

    return (
      <div className="flex justify-center">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${className}`}
          onClick={() => handleInlineEdit(testCase.id, field, value)}
          title="Click to edit"
        >
          {value}
        </span>
      </div>
    )
  }

  // Render inline editable textarea cell for Test Steps and Expected Results
  const renderEditableTextareaCell = (testCase: TestCase, field: string, value: string[], className = "") => {
    const isEditing = inlineEdit?.testCaseId === testCase.id && inlineEdit?.field === field
    const displayValue = formatListWithNumbers(value)

    if (isEditing) {
      return (
        <div className="relative">
          <textarea
            value={inlineEdit.value}
            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
            onBlur={handleInlineEditSave}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleInlineEditSave()
              } else if (e.key === "Escape") {
                handleInlineEditCancel()
              }
            }}
            className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              !inlineEdit.value.trim() ? "border-red-500 bg-red-50" : "border-blue-500"
            }`}
            rows={4}
            autoFocus
            placeholder="Enter each item on a new line"
          />
          <div className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to save, Esc to cancel</div>
        </div>
      )
    }

    return (
      <div
        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors ${className}`}
        onClick={() => handleInlineEdit(testCase.id, field, value.join("\n"))}
        title="Click to edit"
      >
        {displayValue}
      </div>
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = (e.target as HTMLElement).closest(".draggable-dialog")?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setDragPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 添加事件监听器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // Empty state when no test cases
  if (testCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <FaClipboardList className="text-blue-500" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Test Cases Generated</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Upload your requirements documents or enter text to generate comprehensive test cases automatically.
        </p>
        <div className="flex items-center text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
          <FaRocket className="mr-2" size={14} />
          <span>Ready to generate test cases from your requirements</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls with Add Button */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-grow max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" size={14} />
          </div>
          <input
            type="text"
            placeholder="Search test cases"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter || ""}
          onChange={(e) => setTypeFilter(e.target.value || null)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="Positive Case">Positive Case</option>
          <option value="Negative Case">Negative Case</option>
          <option value="Corner Case">Corner Case</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter || ""}
          onChange={(e) => setPriorityFilter(e.target.value || null)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Spacer to push buttons to the right */}
        <div className="flex-grow"></div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center text-gray-700 bg-white hover:bg-gray-50 px-3 py-2 rounded border border-gray-300 hover:border-blue-300 text-sm"
        >
          {exporting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <FaFileExcel className="mr-2 text-green-600" size={14} />
              <span>Export</span>
            </>
          )}
        </button>

        {/* Add Button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          <FaPlus className="mr-2" size={12} />
          Add
        </button>
      </div>

      {/* Header with View Original Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">
          <span>
            Total Test Cases: <span className="font-bold">{filteredTestCases.length}</span>
          </span>
        </div>
        {selectedTask && (
          <button
            onClick={() => setShowDraggableOriginal(true)}
            className="flex items-center text-gray-700 bg-white hover:bg-gray-50 px-3 py-2 rounded border border-gray-300 hover:border-blue-300 text-sm"
          >
            <FaFileAlt className="mr-2 text-blue-600" size={14} />
            <span>View Original</span>
          </button>
        )}
      </div>

      {/* Test Cases Table with Horizontal Scroll */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full">
            {/* Table Header */}
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="w-16 px-4 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-center">
                  No
                </th>
                <th className="w-48 px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-left">
                  Test Case Name
                </th>
                <th className="w-40 px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-left">
                  Functional Module
                </th>
                <th className="w-32 px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-center">
                  Type
                </th>
                <th className="w-24 px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-center">
                  Priority
                </th>
                <th className="w-56 px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-left">
                  Preconditions
                </th>
                <th className="w-80 px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-left">
                  Test Steps
                </th>
                <th className="w-80 px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200 text-left">
                  Expected Results
                </th>
                <th className="w-24 px-6 py-4 font-medium text-sm text-gray-700 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {filteredTestCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 px-4">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaSearch className="text-gray-400" size={20} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Test Cases</h3>
                      <p className="text-sm text-gray-500 text-center">
                        Try adjusting your search terms or filters to find test cases.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTestCases.map((testCase, index) => (
                  <tr
                    key={testCase.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                  >
                    {/* No */}
                    <td className="w-16 px-4 py-5 border-r border-gray-200 text-center">
                      <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                    </td>

                    {/* Test Case Name */}
                    <td className="w-48 px-6 py-5 border-r border-gray-200">
                      {renderEditableCell(
                        testCase,
                        "name",
                        testCase.name,
                        "font-medium text-gray-900 break-words leading-relaxed",
                      )}
                    </td>

                    {/* Functional Module */}
                    <td className="w-40 px-6 py-5 border-r border-gray-200">
                      {renderEditableCell(
                        testCase,
                        "functionalModule",
                        testCase.functionalModule,
                        "text-gray-600 break-words leading-relaxed text-sm",
                      )}
                    </td>

                    {/* Type */}
                    <td className="w-32 px-6 py-5 border-r border-gray-200">
                      {renderEditableSelectCell(
                        testCase,
                        "type",
                        testCase.type,
                        ["Positive Case", "Negative Case", "Corner Case"],
                        getTypeColor(testCase.type),
                      )}
                    </td>

                    {/* Priority */}
                    <td className="w-24 px-6 py-5 border-r border-gray-200">
                      {renderEditableSelectCell(
                        testCase,
                        "priority",
                        testCase.priority,
                        ["High", "Medium", "Low"],
                        getPriorityColor(testCase.priority),
                      )}
                    </td>

                    {/* Preconditions */}
                    <td className="w-56 px-6 py-5 border-r border-gray-200">
                      {renderEditableCell(
                        testCase,
                        "preconditions",
                        testCase.preconditions || "None",
                        "text-gray-600 break-words whitespace-pre-line leading-relaxed text-sm",
                      )}
                    </td>

                    {/* Test Steps */}
                    <td className="w-80 px-6 py-5 border-r border-gray-200">
                      {renderEditableTextareaCell(
                        testCase,
                        "steps",
                        testCase.steps,
                        "text-gray-600 break-words whitespace-pre-line leading-relaxed text-sm",
                      )}
                    </td>

                    {/* Expected Results */}
                    <td className="w-80 px-6 py-5 border-r border-gray-200">
                      {renderEditableTextareaCell(
                        testCase,
                        "expectedResults",
                        testCase.expectedResults,
                        "text-gray-600 break-words whitespace-pre-line leading-relaxed text-sm",
                      )}
                    </td>

                    {/* Actions */}
                    <td className="w-24 px-6 py-5">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEditTestCase(testCase)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation(testCase.id)}
                          className="text-gray-500 hover:text-red-600 p-2 rounded hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Scroll Indicator */}
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
          ← Scroll horizontally to view all columns →
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center">
          <FaCheck className="mr-2" size={14} />
          Successful
        </div>
      )}

      {/* Add Test Case Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Add New Test Case</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Case Name *</label>
                  <Input
                    value={newTestCase.name}
                    onChange={(e) => setNewTestCase({ ...newTestCase, name: e.target.value })}
                    placeholder="Enter test case name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Functional Module *</label>
                  <Input
                    value={newTestCase.functionalModule}
                    onChange={(e) => setNewTestCase({ ...newTestCase, functionalModule: e.target.value })}
                    placeholder="Enter functional module"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newTestCase.type}
                    onChange={(e) =>
                      setNewTestCase({
                        ...newTestCase,
                        type: e.target.value as "Positive Case" | "Negative Case" | "Corner Case",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Positive Case">Positive Case</option>
                    <option value="Negative Case">Negative Case</option>
                    <option value="Corner Case">Corner Case</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTestCase.priority}
                    onChange={(e) =>
                      setNewTestCase({ ...newTestCase, priority: e.target.value as "High" | "Medium" | "Low" })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preconditions</label>
                <TextArea
                  value={newTestCase.preconditions}
                  onChange={(e) => setNewTestCase({ ...newTestCase, preconditions: e.target.value })}
                  rows={3}
                  placeholder="Enter preconditions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Steps *</label>
                {newTestCase.steps.map((step, index) => (
                  <div key={index} className="flex mb-2">
                    <div className="flex-shrink-0 w-8 text-right pr-2 pt-2 text-gray-500">{index + 1}.</div>
                    <Input
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...newTestCase.steps]
                        newSteps[index] = e.target.value
                        setNewTestCase({ ...newTestCase, steps: newSteps })
                      }}
                      className="flex-1"
                      placeholder="Enter test step"
                    />
                    <button
                      onClick={() => {
                        const newSteps = newTestCase.steps.filter((_, i) => i !== index)
                        setNewTestCase({ ...newTestCase, steps: newSteps })
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 p-2"
                      disabled={newTestCase.steps.length === 1}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setNewTestCase({
                      ...newTestCase,
                      steps: [...newTestCase.steps, ""],
                    })
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Step
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Results *</label>
                {newTestCase.expectedResults.map((result, index) => (
                  <div key={index} className="flex mb-2">
                    <div className="flex-shrink-0 w-8 text-right pr-2 pt-2 text-gray-500">{index + 1}.</div>
                    <Input
                      value={result}
                      onChange={(e) => {
                        const newResults = [...newTestCase.expectedResults]
                        newResults[index] = e.target.value
                        setNewTestCase({ ...newTestCase, expectedResults: newResults })
                      }}
                      className="flex-1"
                      placeholder="Enter expected result"
                    />
                    <button
                      onClick={() => {
                        const newResults = newTestCase.expectedResults.filter((_, i) => i !== index)
                        setNewTestCase({ ...newTestCase, expectedResults: newResults })
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 p-2"
                      disabled={newTestCase.expectedResults.length === 1}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setNewTestCase({
                      ...newTestCase,
                      expectedResults: [...newTestCase.expectedResults, ""],
                    })
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Expected Result
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <Button type="primary" onClick={handleAddTestCase}>
                Add Test Case
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Test Case Dialog */}
      {editingTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto edit-dialog">
            <h3 className="text-lg font-medium mb-4">Edit Test Case</h3>
            <div className="text-sm text-gray-500 mb-4">Editing for Version {version}</div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={editingTestCase.name}
                    onChange={(e) => setEditingTestCase({ ...editingTestCase, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Functional Module</label>
                  <Input
                    value={editingTestCase.functionalModule}
                    onChange={(e) => setEditingTestCase({ ...editingTestCase, functionalModule: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={editingTestCase.type}
                    onChange={(e) =>
                      setEditingTestCase({
                        ...editingTestCase,
                        type: e.target.value as "Positive Case" | "Negative Case" | "Corner Case",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Positive Case">Positive Case</option>
                    <option value="Negative Case">Negative Case</option>
                    <option value="Corner Case">Corner Case</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={editingTestCase.priority}
                    onChange={(e) =>
                      setEditingTestCase({
                        ...editingTestCase,
                        priority: e.target.value as "High" | "Medium" | "Low",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preconditions</label>
                <TextArea
                  value={editingTestCase.preconditions}
                  onChange={(e) => setEditingTestCase({ ...editingTestCase, preconditions: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
                {editingTestCase.steps.map((step, index) => (
                  <div key={index} className="flex mb-2">
                    <div className="flex-shrink-0 w-8 text-right pr-2 pt-2 text-gray-500">{index + 1}.</div>
                    <Input
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...editingTestCase.steps]
                        newSteps[index] = e.target.value
                        setEditingTestCase({ ...editingTestCase, steps: newSteps })
                      }}
                      className="flex-1"
                    />
                    <button
                      onClick={() => {
                        const newSteps = editingTestCase.steps.filter((_, i) => i !== index)
                        setEditingTestCase({ ...editingTestCase, steps: newSteps })
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 p-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditingTestCase({
                      ...editingTestCase,
                      steps: [...editingTestCase.steps, ""],
                    })
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Step
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Results</label>
                {editingTestCase.expectedResults.map((result, index) => (
                  <div key={index} className="flex mb-2">
                    <div className="flex-shrink-0 w-8 text-right pr-2 pt-2 text-gray-500">{index + 1}.</div>
                    <Input
                      value={result}
                      onChange={(e) => {
                        const newResults = [...editingTestCase.expectedResults]
                        newResults[index] = e.target.value
                        setEditingTestCase({ ...editingTestCase, expectedResults: newResults })
                      }}
                      className="flex-1"
                    />
                    <button
                      onClick={() => {
                        const newResults = editingTestCase.expectedResults.filter((_, i) => i !== index)
                        setEditingTestCase({ ...editingTestCase, expectedResults: newResults })
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 p-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditingTestCase({
                      ...editingTestCase,
                      expectedResults: [...editingTestCase.expectedResults, ""],
                    })
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Expected Result
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingTestCase(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <Button type="primary" onClick={handleSaveTestCase}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Test Case Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full delete-test-case-dialog">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-2">Are you sure you want to delete this test case? This action cannot be undone.</p>
            <p className="mb-4 text-sm text-gray-500">Deleting from Version {version}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTestCase(deleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draggable Original Content Dialog */}
      {showDraggableOriginal && (
        <div className="fixed inset-0 z-50">
          <div
            className="draggable-dialog absolute bg-white rounded-lg shadow-2xl border border-gray-300 w-96 max-h-[80vh] overflow-hidden"
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              cursor: isDragging ? "grabbing" : "default",
            }}
          >
            {/* Draggable Header */}
            <div
              className="bg-gray-100 px-4 py-3 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaFileAlt className="text-blue-600" size={14} />
                  <h3 className="font-medium text-gray-900">Original Content</h3>
                </div>
                <button
                  onClick={() => setShowDraggableOriginal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <div className="p-2 bg-gray-50 rounded text-sm">{selectedTask?.title || "No title available"}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <div className="p-2 bg-gray-50 rounded text-sm flex items-center">
                    {getFileIcon(selectedTask?.type || "Text")}
                    <span className="ml-2">{selectedTask?.type || "Text"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Created</label>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    {selectedTask?.date ? new Date(selectedTask.date).toLocaleDateString() : "No date available"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Content</label>
                  <div className="p-3 bg-gray-50 rounded text-sm max-h-64 overflow-y-auto">
                    <div className="space-y-2 text-gray-700">
                      <p className="font-medium text-gray-800">Original Content:</p>
                      <div className="pl-2 border-l-2 border-blue-200">
                        <p>{selectedTask?.content || "No content available"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">Drag the header to move this window</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
