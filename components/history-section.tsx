"use client"

import { FaFilePdf, FaFileWord, FaFileAlt, FaTrash } from "react-icons/fa"

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
