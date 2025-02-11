'use client';

import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';

interface SignaturePadProps {
  onSignatureSave: (signature: string | null) => void;
}

export default function SignaturePadComponent({ onSignatureSave }: SignaturePadProps) {
  const sigCanvas = useRef<SignaturePad>(null);
  const [signature, setSignature] = useState<string | null>(null);

  function clearSignature() {
    sigCanvas.current?.clear();
    setSignature(null);
    onSignatureSave(null);
  }

  function saveSignature() {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      setSignature(dataURL);
      onSignatureSave(dataURL);
    }
  }

  function downloadSignature() {
    if (signature) {
      const link = document.createElement('a');
      link.href = signature;
      link.download = 'firma.png';
      link.click();
    }
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Firma digital:</h3>
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{
          className: "border border-gray-300 rounded w-full h-32 bg-white"
        }}
      />
      <div className="mt-2 flex gap-2">
        <button onClick={saveSignature} className="bg-green-500 text-white px-3 py-1 rounded">Guardar Firma</button>
        <button onClick={clearSignature} className="bg-red-500 text-white px-3 py-1 rounded">Limpiar</button>
        {signature && (
          <button onClick={downloadSignature} className="bg-blue-500 text-white px-3 py-1 rounded">Descargar</button>
        )}
      </div>
      {signature && <img src={signature} alt="Firma digital" className="mt-2 border border-gray-300 rounded w-full" />}
    </div>
  );
}
