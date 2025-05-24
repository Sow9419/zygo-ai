"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { ForgotPasswordForm } from "./forgot-password-form"
import { VerifyOTPForm } from "./verify-otp-form"
import { ResetPasswordForm } from "./reset-password-form"
import { LogIn } from "lucide-react"

export type AuthView = "login" | "register" | "forgot-password" | "verify-otp" | "reset-password"

interface AuthDialogProps {
  triggerClassName?: string
  initialView?: AuthView
}

export function AuthDialog({ triggerClassName, initialView = "login" }: AuthDialogProps) {
  const [view, setView] = useState<AuthView>(initialView)
  const [email, setEmail] = useState<string>("") // Pour passer l'email entre les vues
  const [open, setOpen] = useState(false)

  const handleViewChange = (newView: AuthView) => {
    setView(newView)
  }

  const handleEmailCapture = (email: string) => {
    setEmail(email)
  }

  const handleSuccess = () => {
    // Fermer le dialogue après une action réussie si nécessaire
    if (view === "reset-password") {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName} variant="default">
          <LogIn className="h-4 w-4 mr-2" />
          Connexion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">

        {view === "login" && (
          <LoginForm 
            onViewChange={handleViewChange} 
            onSuccess={handleSuccess} 
          />
        )}

        {view === "register" && (
          <RegisterForm 
            onViewChange={handleViewChange} 
            onSuccess={handleSuccess} 
          />
        )}

        {view === "forgot-password" && (
          <ForgotPasswordForm 
            onViewChange={handleViewChange} 
            onEmailCapture={handleEmailCapture} 
            onSuccess={handleSuccess} 
          />
        )}

        {view === "verify-otp" && (
          <VerifyOTPForm 
            email={email} 
            onViewChange={handleViewChange} 
            onSuccess={handleSuccess} 
          />
        )}

        {view === "reset-password" && (
          <ResetPasswordForm 
            email={email} 
            onViewChange={handleViewChange} 
            onSuccess={handleSuccess} 
          />
        )}
      </DialogContent>
    </Dialog>
  )
}