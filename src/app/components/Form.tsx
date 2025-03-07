"use client"

import type React from "react"

import { useState, useRef } from "react"
import { extractDNIData } from "../services/formService"

const Form: React.FC = () => {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [DNI, setDNI] = useState("")
  const [address, setAddress] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [autoCompleteStatus, setAutoCompleteStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [dniFile, setDniFile] = useState<File | null>(null)
  const [dniPreview, setDniPreview] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !surname || !DNI || !address) return

    setStatus("submitting")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simula una petición async
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  async function handleAutoComplete() {
    if (!dniFile) {
      setErrorMessage("Por favor, sube una imagen de tu DNI primero")
      return
    }

    setAutoCompleteStatus("loading")
    setErrorMessage(null)

    try {
      // En producción, usar extractDNIData
      const response = await extractDNIData(dniFile)

      if (response.success && response.data) {
        const dniData = response.data

        // Actualizar los campos del formulario con los datos extraídos
        if (dniData.nombre) setName(dniData.nombre)
        if (dniData.apellido) setSurname(dniData.apellido)
        if (dniData.documento) setDNI(dniData.documento)
        if (dniData.domicilio) setAddress(dniData.domicilio)

        setAutoCompleteStatus("success")
      } else {
        throw new Error(response.error || "No se pudieron extraer los datos del DNI")
      }
    } catch (error) {
      console.error("Error al autocompletar el formulario:", error)
      setAutoCompleteStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Error al procesar el DNI")
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Por favor, selecciona una imagen válida")
        return
      }

      setDniFile(file)

      // Crear una URL para previsualizar la imagen
      const previewUrl = URL.createObjectURL(file)
      setDniPreview(previewUrl)

      // Resetear el estado de autocompletado
      setAutoCompleteStatus("idle")
      setErrorMessage(null)
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md shadow-sm border border-gray-200 rounded-md p-6 space-y-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Formulario</h1>

        {/* Sección para subir DNI */}
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
          <div className="flex flex-col items-center space-y-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {dniPreview ? (
              <div className="relative w-full">
                <img
                  src={dniPreview || "/placeholder.svg"}
                  alt="Vista previa del DNI"
                  className="w-full h-40 object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50"
              >
                <span className="mt-2 text-sm text-gray-500">Sube una imagen de tu DNI</span>
              </button>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu apellido"
              />
            </div>
            <div>
              <label htmlFor="DNI" className="block text-sm font-medium text-gray-700">
                Documento
              </label>
              <input
                type="text"
                id="DNI"
                value={DNI}
                onChange={(e) => setDNI(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu documento"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu dirección"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Enviando..." : "Enviar"}
            </button>

            <button
              type="button"
              onClick={handleAutoComplete}
              disabled={autoCompleteStatus === "loading" || !dniFile}
              className="flex-1 bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {autoCompleteStatus === "loading" ? "Cargando..." : "Autocompletar"}
            </button>
          </div>
        </form>

        {status === "success" && <p className="text-sm text-green-600 font-medium">Formulario enviado exitosamente.</p>}
        {status === "error" && <p className="text-sm text-red-600 font-medium">Error al enviar. Intente nuevamente.</p>}

        {autoCompleteStatus === "error" && !errorMessage && (
          <p className="text-sm text-red-600 font-medium">Error al autocompletar. Intente nuevamente.</p>
        )}
        {autoCompleteStatus === "success" && (
          <p className="text-sm text-green-600 font-medium">Datos autocompletos correctamente.</p>
        )}
      </div>
    </div>
  )
}

export default Form

