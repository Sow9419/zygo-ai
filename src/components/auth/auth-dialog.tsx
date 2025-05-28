"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { LogIn } from "lucide-react"

export type AuthView = "login" | "register"

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
    // Fermer le dialogue après une action réussie
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName} variant="default">
          <LogIn className="h-4 w-4 mr-2" />
          <DialogTitle>
          Connexion
          </DialogTitle>
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

      </DialogContent>
    </Dialog>
  )
}