"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-white" />
      case "info":
        return <Info className="h-5 w-5 text-white" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-500 to-green-600"
      case "error":
        return "bg-gradient-to-r from-red-500 to-red-600"
      case "info":
        return "bg-gradient-to-r from-blue-500 to-blue-600"
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-centerter p-4 rounded-lg shadow-lg ${getBackgroundColor()} transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } z-50 max-w-md`}
    >
      <div className="mr-3">{getIcon()}</div>
      <div className="text-white flex-grow">{message}</div>
      <button onClick={() => setIsVisible(false)} className="ml-3 text-white/80 hover:text-white">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => closeToast(toast.id)} />
      ))}
    </>
  )

  return { showToast, ToastContainer }
}