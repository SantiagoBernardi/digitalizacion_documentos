import axios from "axios"

// Tipos para la respuesta del backend
export interface DNIData {
  nombre?: string
  apellido?: string
  documento?: string
  domicilio?: string
  fechaNacimiento?: string
  sexo?: string
  lugarNacimiento?: string
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

    // Extraemos el contenido del campo "response"
    const responseText = response.data.response
    console.log("Respuesta del backend:", responseText)

    // Intentamos parsear como JSON si es posible
    let dniData: DNIData = {}
    try {
      dniData = JSON.parse(responseText)
    } catch (parseError) {
      console.error("No se pudo parsear como JSON:", responseText)
      // Si no es JSON, usamos el texto como está y asi mostramos el error de la ia en el campo nombre
      dniData = {
        nombre: responseText,
      }
    }

    // Procesamiento de nombre y apellido
    if (dniData.nombre && !dniData.apellido) {
      const nombreCompleto = dniData.nombre.split(" ")
      if (nombreCompleto.length > 1) {
        // Asumimos que el primer término es el apellido
        dniData.apellido = nombreCompleto[0]
        dniData.nombre = nombreCompleto.slice(1).join(" ")
      }
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