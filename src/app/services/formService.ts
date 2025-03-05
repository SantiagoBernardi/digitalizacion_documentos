import axios from "axios"

// Types
export interface UserData {
  name: string
  surname: string
  DNI: string
  address: string
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Service implementation using axios
export async function fetchUserData(): Promise<ServiceResponse<UserData>> {
  try {
    // Real API endpoint
    const response = await axios.get("https://api.example.com/user-data")

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return {
      success: false,
      error: axios.isAxiosError(error) ? error.message : "Unknown error",
    }
  }
}

// Mock implementation for testing
export async function mockFetchUserData(): Promise<ServiceResponse<UserData>> {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock data as if it came from axios
    return {
      success: true,
      data: {
        name: "Juan",
        surname: "Pérez",
        DNI: "12345678",
        address: "Av. Siempreviva 742",
      },
    }
  } catch (error) {
    console.error("Error in mock fetch:", error)
    return {
      success: false,
      error: axios.isAxiosError(error) ? error.message : "Unknown error",
    }
  }
}

