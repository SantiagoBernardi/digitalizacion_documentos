"use client"

import { useState } from "react"
import { uploadFileAndSignature } from "../services/uploadService"
import FileUpload from "./FileUpload"
import SignaturePadComponent from "./SignaturePad"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [processingResult, setProcessingResult] = useState<{
    message?: string
    contratoPDF?: string
    firmaIMG?: string
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleUpload() {
    if (!file && !signature) {
      setErrorMessage("Debes proporcionar al menos un documento PDF o una firma")
      setStatus("error")
      return
    }

    if (!file) {
      setErrorMessage("Debes seleccionar un documento PDF")
      setStatus("error")
      return
    }

    if (!signature) {
      setErrorMessage("Debes proporcionar una firma")
      setStatus("error")
      return
    }

    setStatus("uploading")
    setUploadProgress(0)
    setErrorMessage(null)
    setProcessingResult(null)

    const result = await uploadFileAndSignature({
      file,
      signature,
      onProgress: setUploadProgress,
    })

    if (result.success && result.data) {
      setStatus("success")
      setUploadProgress(100)
      setProcessingResult({
        message: result.data.message,
        contratoPDF: result.data.contratoPDF,
        firmaIMG: result.data.firmaIMG,
      })
    } else {
      setStatus("error")
      setUploadProgress(0)
      setErrorMessage(result.error || "Error al procesar el documento")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md shadow-sm border border-gray-200 rounded-md p-6 space-y-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Firma de Documento</h1>

        <div className="space-y-6">
          {/* Sección para subir PDF */}
          <div className="space-y-2">
            <FileUpload onFileSelect={setFile} />
          </div>

          {/* Sección de firma */}
          <div className="space-y-2">
            <SignaturePadComponent onSignatureSave={setSignature} />
          </div>
        </div>

        {status === "uploading" && (
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={status === "uploading"}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "uploading" ? "Procesando..." : "Firmar Documento"}
        </button>

        {status === "success" && processingResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-green-600 font-medium mb-2">
              {processingResult.message || "Documento procesado correctamente"}
            </p>
            {processingResult.contratoPDF && (
              <p className="text-sm text-gray-700">
                <strong>Documento:</strong> {processingResult.contratoPDF}
              </p>
            )}
            {processingResult.firmaIMG && (
              <p className="text-sm text-gray-700">
                <strong>Firma:</strong> {processingResult.firmaIMG}
              </p>
            )}
            <p className="text-sm text-gray-700 mt-2">
              El documento firmado se ha guardado en la ruta especificada en el servidor.
            </p>
          </div>
        )}

        {status === "error" && (
          <p className="text-sm text-red-600 font-medium">
            {errorMessage || "Error al procesar el documento. Intente nuevamente."}
          </p>
        )}
      </div>
    </div>
  )
}

