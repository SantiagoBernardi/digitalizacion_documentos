'use client';

import { ChangeEvent, useState } from 'react';
import axios from 'axios';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);  
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        }
      });

      setStatus('success');
      setUploadProgress(100);
    } catch {
      setStatus('error');
      setUploadProgress(0);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-gray-700 font-bold mb-4 text-center">Subir Archivo</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Selecciona un archivo:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {file && (
          <div className="mb-4 p-4 border rounded-lg border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-700">
              <strong>Archivo seleccionado:</strong> {file.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-sm text-gray-700">
              <strong>Tipo:</strong> {file.type}
            </p>
          </div>
        )}

        {status === 'uploading' && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">
              {uploadProgress}% subido
            </p>
          </div>
        )}

        {file && status !== 'uploading' && (
          <button
            onClick={handleFileUpload}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Subir Archivo
          </button>
        )}

        {status === 'success' && (
          <p className="mt-4 text-center text-green-600 font-medium">
            ¡Archivo subido exitosamente!
          </p>
        )}

        {status === 'error' && (
          <p className="mt-4 text-center text-red-600 font-medium">
            Error al subir el archivo.
          </p>
        )}
      </div>
    </div>
  );
}
