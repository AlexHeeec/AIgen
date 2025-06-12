"use client"

import { FaFilePdf, FaFileWord, FaFileAlt, FaTrash, FaHistory, FaPlus } from "react-icons/fa"

interface HistoryItem {
  id: string
  title: string
  date: string
  type: string
  version: number
}

interface HistorySectionProps {
  historyItems: HistoryItem[]
  selectedTaskId: string | null
  onSelectTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

export default function HistorySection({
  historyItems,
  selectedTaskId,
  onSelectTask,
  onDeleteTask,
}: HistorySectionProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FaFilePdf className="text-red-500" />
      case "Word":
        return <FaFileWord className="text-blue-500" />
      default:
        return <FaFileAlt className="text-green-500" />
    }
  }

  const getTagColor = (type: string) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-800"
      case "Word":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  // Empty state when no history items
  if (historyItems.length === 0) {
    return (
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaHistory className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Upload files or enter text requirements to start generating test cases. Your history will appear here.
          </p>
          <div className="flex items-center text-xs text-gray-400">
            <FaPlus className="mr-1" size={10} />
            <span>Upload files or enter text to get started</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
      {historyItems.map((item) => (
        <li
          key={item.id}
          className={`py-2 px-3 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedTaskId === item.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
          }`}
          onClick={() => onSelectTask(item.id)}
        >
          <div className="flex items-start">
            <div className="mr-2 mt-1">{getIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              <div className="flex items-center mt-1 flex-wrap">
                <p className="text-xs text-gray-500 mr-2">{item.date}</p>
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${getTagColor(item.type)}`}>{item.type}</span>
                <span className="ml-2 text-xs text-gray-500">v{item.version}</span>
              </div>
            </div>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTask(item.id)
                }}
                className="text-gray-400 hover:text-red-600 transition-colors p-1"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
