// Excel export utility functions

export interface ExportColumn {
  key: string
  header: string
  width?: number
}

export interface ExportConfig {
  columns: ExportColumn[]
  fileName: string
}

// Default export configuration with updated headers
export const defaultExportConfig: ExportConfig = {
  fileName: "test-cases-export",
  columns: [
    { key: "id", header: "Test Case ID", width: 15 },
    { key: "feature", header: "Feature Point", width: 20 },
    { key: "module", header: "Functional Module", width: 20 },
    { key: "preconditions", header: "Preconditions", width: 30 },
    { key: "steps", header: "Test Steps", width: 40 },
    { key: "expectedResults", header: "Expected Results", width: 40 },
    { key: "actualResults", header: "Actual Results", width: 40 },
    { key: "priority", header: "Priority", width: 10 },
  ],
}

// Generate a random but ordered ID for test cases
function generateTestCaseId(index: number, prefix = "TC"): string {
  // Create a base number that's ordered but has some randomness
  const baseNumber = (index + 1) * 10 + Math.floor(Math.random() * 5)
  // Format with leading zeros
  return `${prefix}-${baseNumber.toString().padStart(4, "0")}`
}

// Function to format list items with numbers
function formatListWithNumbers(items: string[] | string): string {
  if (!items) return ""

  if (typeof items === "string") {
    return items
  }

  return items.map((item, index) => `${index + 1}. ${item}`).join("\n")
}

// Function to prepare test case data for export
export function prepareTestCasesForExport(testCases: any[], taskTitle: string) {
  return testCases.map((testCase, index) => {
    return {
      id: generateTestCaseId(index),
      feature: taskTitle,
      module: testCase.module || "General", // Default to "General" if not specified
      preconditions: formatListWithNumbers(testCase.preconditions),
      steps: formatListWithNumbers(testCase.steps),
      expectedResults: formatListWithNumbers(testCase.expectedResults),
      actualResults: "", // Empty by default
      priority: testCase.priority,
    }
  })
}

// Function to generate CSV content
export function generateCSV(data: any[], config: ExportConfig): string {
  // Create header row
  const headers = config.columns.map((col) => `"${col.header}"`).join(",")

  // Create data rows
  const rows = data.map((item) => {
    return config.columns
      .map((col) => {
        const value = item[col.key] || ""
        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(",")
  })

  // Combine headers and rows
  return [headers, ...rows].join("\n")
}

// Function to download CSV as Excel file
export function downloadExcel(csvContent: string, fileName: string): void {
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Set link properties
  link.href = url
  link.setAttribute("download", `${fileName}.csv`)
  link.style.visibility = "hidden"

  // Add link to document, click it, and remove it
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Main export function
export function exportTestCasesToExcel(
  testCases: any[],
  taskTitle: string,
  config: ExportConfig = defaultExportConfig,
): void {
  // Prepare data
  const data = prepareTestCasesForExport(testCases, taskTitle)

  // Generate CSV content
  const csvContent = generateCSV(data, config)

  // Download as Excel file
  downloadExcel(csvContent, config.fileName)
}

// Function to validate export configuration
export function validateExportConfig(config: ExportConfig): { valid: boolean; message: string } {
  // Check if columns array exists and has items
  if (!config.columns || config.columns.length === 0) {
    return { valid: false, message: "Export configuration must include at least one column" }
  }

  // Check if all columns have key and header
  const invalidColumns = config.columns.filter((col) => !col.key || !col.header)
  if (invalidColumns.length > 0) {
    return { valid: false, message: "All columns must have key and header properties" }
  }

  // Check if fileName exists
  if (!config.fileName) {
    return { valid: false, message: "Export configuration must include a fileName" }
  }

  return { valid: true, message: "Export configuration is valid" }
}

// Function to modify export configuration
export function modifyExportConfig(
  currentConfig: ExportConfig,
  action: "add" | "remove" | "rename" | "reorder",
  params: any,
): { config: ExportConfig; success: boolean; message: string } {
  // Create a deep copy of the current config
  const newConfig = JSON.parse(JSON.stringify(currentConfig)) as ExportConfig

  try {
    switch (action) {
      case "add":
        // Add a new column
        if (!params.key || !params.header) {
          return {
            config: currentConfig,
            success: false,
            message: "Column key and header are required to add a column",
          }
        }

        // Check if column with this key already exists
        if (newConfig.columns.some((col) => col.key === params.key)) {
          return {
            config: currentConfig,
            success: false,
            message: `Column with key '${params.key}' already exists`,
          }
        }

        // Add the new column
        newConfig.columns.push({
          key: params.key,
          header: params.header,
          width: params.width || 20,
        })

        return {
          config: newConfig,
          success: true,
          message: `Added column '${params.header}'`,
        }

      case "remove":
        // Remove a column
        if (!params.key) {
          return {
            config: currentConfig,
            success: false,
            message: "Column key is required to remove a column",
          }
        }

        // Find the column to remove
        const columnToRemoveIndex = newConfig.columns.findIndex((col) => col.key === params.key)
        if (columnToRemoveIndex === -1) {
          return {
            config: currentConfig,
            success: false,
            message: `Column with key '${params.key}' not found`,
          }
        }

        // Remove the column
        const removedColumn = newConfig.columns.splice(columnToRemoveIndex, 1)[0]

        return {
          config: newConfig,
          success: true,
          message: `Removed column '${removedColumn.header}'`,
        }

      case "rename":
        // Rename a column
        if (!params.key || !params.newHeader) {
          return {
            config: currentConfig,
            success: false,
            message: "Column key and new header are required to rename a column",
          }
        }

        // Find the column to rename
        const columnToRename = newConfig.columns.find((col) => col.key === params.key)
        if (!columnToRename) {
          return {
            config: currentConfig,
            success: false,
            message: `Column with key '${params.key}' not found`,
          }
        }

        // Rename the column
        const oldHeader = columnToRename.header
        columnToRename.header = params.newHeader

        return {
          config: newConfig,
          success: true,
          message: `Renamed column from '${oldHeader}' to '${params.newHeader}'`,
        }

      case "reorder":
        // Reorder columns
        if (!params.keys || !Array.isArray(params.keys)) {
          return {
            config: currentConfig,
            success: false,
            message: "An array of column keys is required to reorder columns",
          }
        }

        // Check if all keys exist
        const allKeysExist = params.keys.every((key: string) => newConfig.columns.some((col) => col.key === key))

        if (!allKeysExist) {
          return {
            config: currentConfig,
            success: false,
            message: "Some column keys in the reorder list don't exist",
          }
        }

        // Check if all columns are included
        if (params.keys.length !== newConfig.columns.length) {
          return {
            config: currentConfig,
            success: false,
            message: "Reorder list must include all columns",
          }
        }

        // Create a new array of columns in the specified order
        const reorderedColumns = params.keys.map((key: string) => newConfig.columns.find((col) => col.key === key))

        newConfig.columns = reorderedColumns

        return {
          config: newConfig,
          success: true,
          message: "Columns reordered successfully",
        }

      default:
        return {
          config: currentConfig,
          success: false,
          message: `Unknown action: ${action}`,
        }
    }
  } catch (error) {
    return {
      config: currentConfig,
      success: false,
      message: `Error modifying export configuration: ${error}`,
    }
  }
}
