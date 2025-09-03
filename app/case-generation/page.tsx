"use client"

import { useState } from "react"
import WorkspaceLayout from "@/components/workspace-layout"
import { FaClipboardList, FaRobot } from "react-icons/fa"

export default function CaseGenerationPage() {
  const [isLoading, setIsLoading] = useState(false)

  const mockTestCases = [
    {
      id: "1",
      name: "Verify user login with valid credentials",
      module: "Authentication",
      type: "Positive Case",
      priority: "High",
      steps: ["Navigate to login page", "Enter valid credentials", "Click login button"],
      expectedResults: ["User is logged in successfully", "Dashboard is displayed"],
    },
    {
      id: "2",
      name: "Verify user login with invalid credentials",
      module: "Authentication",
      type: "Negative Case",
      priority: "High",
      steps: ["Navigate to login page", "Enter invalid credentials", "Click login button"],
      expectedResults: ["Error message is displayed", "User remains on login page"],
    },
  ]

  return (
    <WorkspaceLayout>
      {/* Generated Test Cases Module */}
      <div className="col-span-12 md:col-span-8 flex flex-col h-full overflow-auto p-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-semibold flex items-center">
              <FaClipboardList className="mr-2 text-blue-600" size={20} />
              Generated Test Cases
            </h2>
          </div>

          <div className="p-3 flex-1 overflow-auto">
            {mockTestCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <FaClipboardList className="text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Test Cases Generated</h3>
                <p className="text-gray-500 text-center">
                  Upload your requirements to generate test cases automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-600 mb-4">
                  Total Test Cases: <span className="font-bold text-gray-900">{mockTestCases.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Test Case Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Module</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockTestCases.map((testCase, index) => (
                        <tr key={testCase.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-3 text-sm text-gray-900">{testCase.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{testCase.module}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                testCase.type === "Positive Case"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {testCase.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                testCase.priority === "High"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {testCase.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Module */}
      <div className="col-span-12 md:col-span-4 flex flex-col h-full overflow-auto p-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-semibold flex items-center">
              <FaRobot className="mr-2 text-green-600" size={20} />
              AI Assistant
            </h2>
          </div>

          <div className="p-3 flex-1 overflow-auto flex flex-col">
            <div className="flex-1 space-y-3 mb-4">
              <div className="flex justify-start">
                <div className="flex max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                    <FaRobot className="text-gray-600" size={12} />
                  </div>
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none text-sm">
                    Hello! I'm your AI assistant. I can help you generate and refine test cases based on your
                    requirements.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="w-[70%] py-2 px-3 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  disabled={isLoading}
                  className="w-[30%] py-2 px-3 bg-blue-500 text-white rounded-r-md text-sm font-medium hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
