'use client';

import { ChangeEvent, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Selecciona un archivo:
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {file && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <p className="text-sm text-gray-700">
            <strong>Archivo seleccionado:</strong> {file.name}
          </p>
        </div>
      )}
    </div>
  );
}
