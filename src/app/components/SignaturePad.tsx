"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface SignaturePadProps {
  onSignatureSave: (signature: string | null) => void
}

export default function SignaturePadComponent({ onSignatureSave }: SignaturePadProps) {
  const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        setContext(ctx)
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
      }
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    if (context) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.beginPath()
      context.moveTo(x, y)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    if (context) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL()
      setSignatureDataURL(dataURL)
      onSignatureSave(dataURL)
    }
  }

  const handleMouseLeave = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      setSignatureDataURL(null)
      onSignatureSave(null)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Firma digital</label>
      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full bg-white border border-gray-200 rounded-md cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex-1 bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Limpiar
          </button>
        </div>
        {signatureDataURL && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Vista previa de la firma:</strong>
            </p>
            <img
              src={signatureDataURL || "/placeholder.svg"}
              alt="Firma"
              className="max-h-20 border rounded-md bg-white"
            />
          </div>
        )}
      </div>
    </div>
  )
}

