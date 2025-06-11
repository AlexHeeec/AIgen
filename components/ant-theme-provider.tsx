"use client"

import type React from "react"
import { ConfigProvider } from "antd"

// Define theme configuration without importing from @ant-design/colors
const themeConfig = {
  token: {
    colorPrimary: "#1890ff",
  },
}

export default function AntThemeProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
}
