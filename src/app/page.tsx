"use client"

import { useState } from "react"

import Form from "./components/Form"
import Upload from "./components/Upload"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Tabs navigation */}
        <div className="flex w-full mb-8 bg-gray-50 p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-center font-medium transition-all duration-200 ${
              activeTab === "upload"
                ? "bg-white text-primary rounded-lg shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            }`}
          >
          
            <span>Subir Documentos</span>
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-center font-medium transition-all duration-200 ${
              activeTab === "form"
                ? "bg-white text-primary rounded-lg shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            }`}
          >
           
            <span>Formulario</span>
          </button>
        </div>

        {/* Tab content with fade transition */}
        <div className="mt-4 transition-opacity duration-300">
          {activeTab === "upload" && (
            <div className="animate-fadeIn">
              <Upload />
            </div>
          )}
          {activeTab === "form" && (
            <div className="animate-fadeIn">
              <Form />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

