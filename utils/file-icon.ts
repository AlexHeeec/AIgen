import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa"

export const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return FaFilePdf
    case "word":
    case "docx":
      return FaFileWord
    case "text":
    case "txt":
      return FaFileAlt
    default:
      return FaFileAlt
  }
}

export const getFileIconColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "text-red-500"
    case "word":
    case "docx":
      return "text-blue-500"
    case "text":
    case "txt":
      return "text-green-500"
    default:
      return "text-gray-500"
  }
}
