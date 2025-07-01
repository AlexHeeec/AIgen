import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa"

export const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF":
      return <FaFilePdf className="text-red-500" size={12} />
    case "Word":
      return <FaFileWord className="text-blue-500" size={12} />
    default:
      return <FaFileAlt className="text-green-500" size={12} />
  }
}
