"use client"

import { type ChangeEvent, useState, useRef } from "react"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null)

    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]

      if (selectedFile.type !== "application/pdf") {
        setError("El archivo debe ser un PDF")
        setFile(null)
        onFileSelect(null)
        return
      }

      setFile(selectedFile)
      onFileSelect(selectedFile)
    } else {
      setFile(null)
      onFileSelect(null)
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Documento PDF</label>
      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
        <div className="flex flex-col items-center space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          {file ? (
            <div className="w-full p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Documento seleccionado:</strong> {file.name}
              </p>
              <button
                type="button"
                onClick={handleUploadClick}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Cambiar documento
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUploadClick}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50"
            >
              <span className="mt-2 text-sm text-gray-500">Haz clic para seleccionar un documento PDF</span>
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

