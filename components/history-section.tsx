"use client"
import { FaTrash, FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa"

interface HistoryItem {
  id: string
  title: string
  date: string
  type: string
}

interface HistorySectionProps {
  historyItems: HistoryItem[]
  selectedTaskId: string | null
  onSelectTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function HistorySection({
  historyItems,
  selectedTaskId,
  onSelectTask,
  onDeleteTask,
}: HistorySectionProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FaFilePdf className="text-red-500" size={14} />
      case "Word":
        return <FaFileWord className="text-blue-500" size={14} />
      default:
        return <FaFileAlt className="text-green-500" size={14} />
    }
  }

  if (historyItems.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <FaFileAlt size={32} className="mx-auto" />
        </div>
        <p className="text-sm text-gray-500">No history yet</p>
        <p className="text-xs text-gray-400 mt-1">Upload files to start generating test cases</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {historyItems.map((item) => (
        <div
          key={item.id}
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            selectedTaskId === item.id ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
          }`}
          onClick={() => onSelectTask(item.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                {getFileIcon(item.type)}
                <span className="ml-2 text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteTask(item.id)
              }}
              className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
              title="Delete task"
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
