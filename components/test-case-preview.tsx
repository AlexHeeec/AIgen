"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useState, useMemo, useEffect } from "react"
import { FaEdit, FaPlus, FaTimes, FaDownload, FaSave } from "react-icons/fa"
import { type ExportConfig, defaultExportConfig } from "@/utils/excel-export"

interface TestCase {
  id: string
  name: string
  functionalModule: string
  type: string
  preconditions: string
  steps: string[]
  expectedResults: string[]
  priority: string
}

interface TestCasePreviewProps {
  testCases: TestCase[]
  version: number
  availableVersions: number[]
  onVersionSelect: (version: number) => void
  taskTitle: string
  exportConfig: ExportConfig
  selectedTask: any
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
  type: string
  preconditions: string
  steps: string[]
  expectedResults: string[]
  priority: string
}

export default function TestCasePreview({
  testCases,
  version,
  availableVersions,
  onVersionSelect,
  taskTitle,
  exportConfig = defaultExportConfig,
  selectedTask,
}: TestCasePreviewProps): ReactElement {
  const [searchText, setSearchText] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTestCase, setNewTestCase] = useState({
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
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [localTestCases, setLocalTestCases] = useState(testCases)
  const [showAddForm, setShowAddForm] = useState(false)

  // Update local test cases when props change
  useEffect(() => {
    setLocalTestCases(testCases)
  }, [testCases])

  // Filter test cases based on search text, priority filter, and type filter
  const filteredTestCases = useMemo(() => {
    return localTestCases.filter(
      (testCase) =>
        testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testCase.functionalModule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testCase.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [localTestCases, searchTerm])

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
    console.log("Exporting test cases with config:", exportConfig)
    // In a real app, this would trigger the actual export
  }

  const handleInlineEdit = (id: string, field: string, currentValue: any) => {
    setEditingCell({ id, field })
    if (Array.isArray(currentValue)) {
      setEditValue(currentValue.join("\n"))
    } else {
      setEditValue(currentValue)
    }
  }

  const handleInlineEditSave = () => {
    if (!editingCell) return

    setLocalTestCases((prev) =>
      prev.map((tc) => {
        if (tc.id === editingCell.id) {
          const updatedTC = { ...tc }
          if (editingCell.field === "steps" || editingCell.field === "expectedResults") {
            updatedTC[editingCell.field] = editValue.split("\n").filter((item) => item.trim())
          } else {
            updatedTC[editingCell.field] = editValue
          }
          return updatedTC
        }
        return tc
      }),
    )
    setEditingCell(null)
    setEditValue("")
  }

  const handleInlineEditCancel = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const handleAddTestCase = () => {
    const id = `tc-${Date.now()}`
    const testCase = {
      ...newTestCase,
      id,
      steps: newTestCase.steps.filter((step) => step.trim()),
      expectedResults: newTestCase.expectedResults.filter((result) => result.trim()),
    }

    setLocalTestCases((prev) => [...prev, testCase])
    setNewTestCase({
      name: "",
      functionalModule: "",
      type: "Positive Case",
      preconditions: "",
      steps: [""],
      expectedResults: [""],
      priority: "Medium",
    })
    setShowAddForm(false)
  }

  const showSuccessMessage = () => {
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 2000)
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
  if (localTestCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaEdit className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Cases Yet</h3>
          <p className="text-gray-600 mb-4">Upload requirements to generate test cases automatically</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with count and search */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredTestCases.length} test case{filteredTestCases.length !== 1 ? "s" : ""} found
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search test cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            <FaPlus className="mr-1" size={12} />
            Add
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <FaDownload className="mr-1" size={12} />
            Export
          </button>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-8">
                NO
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-16">
                Priority
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-20">
                Type
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">
                Functional Module
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Test Case Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Preconditions
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Test Steps
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Expected Results
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTestCases.map((testCase, index) => (
              <tr key={testCase.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">{index + 1}</td>
                <td className="px-3 py-2 text-sm border-r border-gray-200">
                  {editingCell?.id === testCase.id && editingCell?.field === "priority" ? (
                    <div className="flex items-center space-x-1">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <button onClick={handleInlineEditSave} className="text-green-600 hover:text-green-700">
                        <FaSave size={10} />
                      </button>
                      <button onClick={handleInlineEditCancel} className="text-red-600 hover:text-red-700">
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded cursor-pointer ${
                        testCase.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : testCase.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                      onClick={() => handleInlineEdit(testCase.id, "priority", testCase.priority)}
                    >
                      {testCase.priority}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm border-r border-gray-200">
                  {editingCell?.id === testCase.id && editingCell?.field === "type" ? (
                    <div className="flex items-center space-x-1">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Positive Case">Positive Case</option>
                        <option value="Negative Case">Negative Case</option>
                        <option value="Corner Case">Corner Case</option>
                      </select>
                      <button onClick={handleInlineEditSave} className="text-green-600 hover:text-green-700">
                        <FaSave size={10} />
                      </button>
                      <button onClick={handleInlineEditCancel} className="text-red-600 hover:text-red-700">
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className="text-gray-900 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                      onClick={() => handleInlineEdit(testCase.id, "type", testCase.type)}
                    >
                      {testCase.type}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                  {editingCell?.id === testCase.id && editingCell?.field === "functionalModule" ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                      />
                      <button onClick={handleInlineEditSave} className="text-green-600 hover:text-green-700">
                        <FaSave size={10} />
                      </button>
                      <button onClick={handleInlineEditCancel} className="text-red-600 hover:text-red-700">
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                      onClick={() => handleInlineEdit(testCase.id, "functionalModule", testCase.functionalModule)}
                    >
                      {testCase.functionalModule}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                  {editingCell?.id === testCase.id && editingCell?.field === "name" ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                      />
                      <button onClick={handleInlineEditSave} className="text-green-600 hover:text-green-700">
                        <FaSave size={10} />
                      </button>
                      <button onClick={handleInlineEditCancel} className="text-red-600 hover:text-red-700">
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                      onClick={() => handleInlineEdit(testCase.id, "name", testCase.name)}
                    >
                      {testCase.name}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                  {editingCell?.id === testCase.id && editingCell?.field === "preconditions" ? (
                    <div className="flex items-center space-x-1">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full resize-none"
                        rows={2}
                      />
                      <div className="flex flex-col space-y-1">
                        <button onClick={handleInlineEditSave} className="text-green-600 hover:text-green-700">
                          <FaSave size={10} />
                        </button>
                        <button onClick={handleInlineEditCancel} className="text-red-600 hover:text-red-700">
                          <FaTimes size={10} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span
                      className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded block"
                      onClick={() => handleInlineEdit(testCase.id, "preconditions", testCase.preconditions)}
                    >
                      {testCase.preconditions}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                  {editingCell?.id === testCase.id && editingCell?.field === "steps" ? (
                    <div className="flex items-start space-x-1">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full resize-none"
                        rows={3}
                        placeholder="Enter each step on a new line"
                      />
                      <div className="flex flex-col space-y-1">
                        <button onClick={handleInlineEditSave} className="text-green-600 hover:text-green-700">
                          <FaSave size={10} />
                        </button>
                        <button onClick={handleInlineEditCancel} className="text-red-600 hover:text-red-700">
                          <FaTimes size={10} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                      onClick={() => handleInlineEdit(testCase.id, "steps", testCase.steps)}
                    >
                      <ol className="list-decimal list-inside space-y-1">
                        {testCase.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-xs">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900">
                  {editingCell?.id === testCase.id && editingCell?.field === "expectedResults" ? (
                    <div className="flex items-start space-x-1">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full resize-none"
                        rows={3}
                        placeholder="Enter each expected result on a new line"
                      />
                      <div className="flex flex-col space-y-1">
                        <button onClick={handleInlineEditSave} className="text-green-600 hover:text-green-700">
                          <FaSave size={10} />
                        </button>
                        <button onClick={handleInlineEditCancel} className="text-red-600 hover:text-red-700">
                          <FaTimes size={10} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                      onClick={() => handleInlineEdit(testCase.id, "expectedResults", testCase.expectedResults)}
                    >
                      <ul className="list-disc list-inside space-y-1">
                        {testCase.expectedResults.map((result, resultIndex) => (
                          <li key={resultIndex} className="text-xs">
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Test Case Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Test Case</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Case Name</label>
                <input
                  type="text"
                  value={newTestCase.name}
                  onChange={(e) => setNewTestCase((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter test case name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Functional Module</label>
                  <input
                    type="text"
                    value={newTestCase.functionalModule}
                    onChange={(e) => setNewTestCase((prev) => ({ ...prev, functionalModule: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Authentication"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newTestCase.type}
                    onChange={(e) => setNewTestCase((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Positive Case">Positive Case</option>
                    <option value="Negative Case">Negative Case</option>
                    <option value="Corner Case">Corner Case</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTestCase.priority}
                  onChange={(e) => setNewTestCase((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preconditions</label>
                <textarea
                  value={newTestCase.preconditions}
                  onChange={(e) => setNewTestCase((prev) => ({ ...prev, preconditions: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter preconditions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Steps</label>
                <textarea
                  value={newTestCase.steps.join("\n")}
                  onChange={(e) => setNewTestCase((prev) => ({ ...prev, steps: e.target.value.split("\n") }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each step on a new line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Results</label>
                <textarea
                  value={newTestCase.expectedResults.join("\n")}
                  onChange={(e) => setNewTestCase((prev) => ({ ...prev, expectedResults: e.target.value.split("\n") }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each expected result on a new line"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTestCase}
                disabled={!newTestCase.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Test Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
