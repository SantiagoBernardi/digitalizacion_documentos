import axios from "axios"

// Tipos para la respuesta del backend
export interface DNIData {
  nombre: string
  sexo: string
  documento: string
  fechaNacimiento: string
  domicilio: string
  lugarNacimiento: string
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Función para extraer datos de un DNI mediante imagen
export async function extractDNIData(dniImage: File): Promise<ServiceResponse<DNIData>> {
  try {
    const formData = new FormData()
    formData.append("file", dniImage)

    const response = await axios.post<{ response: string }>("http://localhost:3000/contratos/extract/dni", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    // La respuesta del backend viene como un string en el campo "response"
    // Necesitamos parsearlo para obtener los datos estructurados
    let dniData: DNIData

    try {
      // Intentamos parsear el JSON si viene en formato JSON
      dniData = JSON.parse(response.data.response)
    } catch (parseError) {
      // Si no es un JSON válido, intentamos extraer los datos del texto
      const textResponse = response.data.response
      dniData = extractDataFromText(textResponse)
    }

    return {
      success: true,
      data: dniData,
    }
  } catch (error) {
    console.error("Error extracting DNI data:", error)
    return {
      success: false,
      error: axios.isAxiosError(error) ? error.message : "Error desconocido al procesar el DNI",
    }
  }
}

// Función auxiliar para extraer datos de texto no estructurado
function extractDataFromText(text: string): DNIData {
  // Implementación básica para extraer datos de texto
  // Esta función puede necesitar ajustes según el formato exacto de la respuesta
  const lines = text.split("\n").map((line) => line.trim())

  // Valores por defecto
  const data: DNIData = {
    nombre: "",
    sexo: "",
    documento: "",
    fechaNacimiento: "",
    domicilio: "",
    lugarNacimiento: "",
  }

  // Buscar datos en el texto
  for (const line of lines) {
    if (line.includes("Nombre") || line.includes("NOMBRE")) {
      data.nombre = line.split(":")[1]?.trim() || ""
    } else if (line.includes("Sexo") || line.includes("SEXO")) {
      data.sexo = line.split(":")[1]?.trim() || ""
    } else if (line.includes("DNI") || line.includes("Documento")) {
      data.documento = line.split(":")[1]?.trim() || ""
    } else if (line.includes("Nacimiento") || line.includes("NACIMIENTO")) {
      data.fechaNacimiento = line.split(":")[1]?.trim() || ""
    } else if (line.includes("Domicilio") || line.includes("DOMICILIO")) {
      data.domicilio = line.split(":")[1]?.trim() || ""
    } else if (line.includes("Lugar") && line.includes("Nacimiento")) {
      data.lugarNacimiento = line.split(":")[1]?.trim() || ""
    }
  }

  return data
}

// Mock para pruebas
export async function mockExtractDNIData(): Promise<ServiceResponse<DNIData>> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    data: {
      nombre: "JUAN CARLOS PEREZ",
      sexo: "M",
      documento: "12345678",
      fechaNacimiento: "01/01/1980",
      domicilio: "AV. SIEMPREVIVA 742",
      lugarNacimiento: "BUENOS AIRES",
    },
  }
}

