import axios from 'axios';

export async function uploadFileAndSignature(
    file: File | null,
    signature: string | null,
    onProgress?: (progress: number) => void // Nuevo callback opcional
  ) {
    if (!file && !signature) return;
  
    const formData = new FormData();
    if (file) formData.append('files', file, file.name);
    if (signature) {
      const response = await fetch(signature);
      const blob = await response.blob();
      formData.append('files', blob, 'signature.png');
    }
  
    try {
      const response = await axios.post("https://httpbin.org/post", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          if (onProgress) onProgress(progress); // Llamamos al callback
        }
      });
  
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error uploading file/signature", error);
      return { success: false };
    }
  }
  