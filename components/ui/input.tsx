"use client"

import type React from "react"

interface InputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  disabled?: boolean
  prefix?: React.ReactNode
  onPressEnter?: () => void
}

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  prefix,
  onPressEnter,
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onPressEnter) {
      onPressEnter()
    }
  }

  return (
    <div className="relative flex items-center">
      {prefix && <div className="absolute left-3 text-gray-400">{prefix}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 ${prefix ? "pl-10" : ""} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export function TextArea({
  placeholder,
  value,
  onChange,
  rows = 4,
  className = "",
  disabled = false,
}: {
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  className?: string
  disabled?: boolean
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
    />
  )
}
