import axios from "axios"

// Types
export interface FileUploadOptions {
  file?: File | null
  signature?: string | null
  onProgress?: (progress: number) => void
}
export interface HttpBinResponse {
  files: Record<string, string>
  form: Record<string, string>
  headers: Record<string, string>
  json: null
  origin: string
  url: string
}

export interface FileUploadResult {
  fileUrls?: string[]
  responseData?: HttpBinResponse
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
    if (file) formData.append("files", file, file.name)

    if (signature) {
      const response = await fetch(signature)
      const blob = await response.blob()
      formData.append("files", blob, "signature.png")
    }

    const response = await axios.post("https://httpbin.org/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0
        if (onProgress) onProgress(progress)
      },
    })

    return {
      success: true,
      data: {
        responseData: response.data,
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