import axios from "axios"

// Types
export interface FileUploadOptions {
  file?: File | null
  signature?: string | null
  onProgress?: (progress: number) => void
}

export interface FileUploadResult {
  success: boolean
  message?: string
  contratoPDF?: string
  firmaIMG?: string
  error?: string
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Service implementation
export async function uploadFileAndSignature({
  file,
  signature,
  onProgress,
}: FileUploadOptions): Promise<ServiceResponse<FileUploadResult>> {
  if (!file && !signature) {
    return {
      success: false,
      error: "No file or signature provided",
    }
  }

  const formData = new FormData()

  try {
    // Preparar los archivos para el backend
    if (file) {
      formData.append("files", file, file.name)
    }

    if (signature) {
      // Convertir la firma (data URL) a un Blob
      const response = await fetch(signature)
      const blob = await response.blob()
      formData.append("files", blob, "signature.png")
    }

    // Enviar al endpoint del backend
    const response = await axios.post("http://localhost:3000/contratos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0
        if (onProgress) onProgress(progress)
      },
    })

    // El backend devuelve un objeto JSON con información sobre los archivos procesados
    return {
      success: true,
      data: {
        success: true,
        message: response.data.message || "Documento procesado correctamente",
        contratoPDF: response.data.contratoPDF,
        firmaIMG: response.data.firmaIMG,
      },
    }
  } catch (error) {
    console.error("Error uploading file/signature", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

