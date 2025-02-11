"use client"

import { useState } from "react"
import { uploadFileAndSignature } from "./services/uploadService"
import FileUpload from "./components/FileUpload"
import SignaturePadComponent from "./components/SignaturePad"

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  async function handleUpload() {
    if (!file && !signature) return

    setStatus("uploading")
    setUploadProgress(0)

    const result = await uploadFileAndSignature(file, signature, setUploadProgress)

    if (result && result.success) {
      setStatus("success")
      setUploadProgress(100)
    } else {
      setStatus("error")
      setUploadProgress(0)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-sm border border-gray-200 rounded-md p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Subir Documento</h1>

        <div className="space-y-4">
          <FileUpload onFileSelect={setFile} />
          <SignaturePadComponent onSignatureSave={setSignature} />
        </div>

        {status === "uploading" && (
          <div className="w-full my-4">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Subir
        </button>

        {status === "success" && <p className="text-sm text-green-600 font-medium">Documento subido exitosamente.</p>}
        {status === "error" && (
          <p className="text-sm text-red-600 font-medium">Error al subir el documento. Intente nuevamente.</p>
        )}
      </div>
    </div>
  )
}

