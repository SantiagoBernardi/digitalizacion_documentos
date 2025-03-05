"use client"

import type React from "react"

import { useState } from "react"
import { mockFetchUserData } from "../services/formService"

const Form: React.FC = () => {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [DNI, setDNI] = useState("")
  const [address, setAddress] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [autoCompleteStatus, setAutoCompleteStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

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
    setAutoCompleteStatus("loading")

    try {
      // Use mockFetchUserData for testing, replace with fetchUserData for production
      const response = await mockFetchUserData()

      if (response.success && response.data) {
        // Update form fields with the fetched data
        setName(response.data.name)
        setSurname(response.data.surname)
        setDNI(response.data.DNI)
        setAddress(response.data.address)
        setAutoCompleteStatus("success")
      } else {
        throw new Error(response.error || "Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error autocompleting form:", error)
      setAutoCompleteStatus("error")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md shadow-sm border border-gray-200 rounded-md p-6 space-y-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Formulario</h1>
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
              disabled={autoCompleteStatus === "loading"}
              className="flex-1 bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              {autoCompleteStatus === "loading" ? "Cargando..." : "Autocompletar"}
            </button>
          </div>
        </form>

        {status === "success" && <p className="text-sm text-green-600 font-medium">Formulario enviado exitosamente.</p>}
        {status === "error" && <p className="text-sm text-red-600 font-medium">Error al enviar. Intente nuevamente.</p>}

        {autoCompleteStatus === "error" && (
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

