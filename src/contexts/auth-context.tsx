"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Toast } from "@/components/core/toast"

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
  verifyOTP: (email: string, otp: string) => Promise<boolean>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null)

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simuler la vérification d'authentification
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simuler une API de connexion
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Vérification simple (à remplacer par une vraie API)
      if (email && password.length >= 6) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split("@")[0],
        }
        
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        
        setToast({
          message: "Connexion réussie",
          type: "success",
        })
        
        return true
      } else {
        setToast({
          message: "Email ou mot de passe incorrect",
          type: "error",
        })
        return false
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setToast({
        message: "Une erreur est survenue lors de la connexion",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction d'inscription
  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simuler une API d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email && password.length >= 6) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: name || email.split("@")[0],
        }
        
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        
        setToast({
          message: "Inscription réussie",
          type: "success",
        })
        
        return true
      } else {
        setToast({
          message: "Email ou mot de passe invalide",
          type: "error",
        })
        return false
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setToast({
        message: "Une erreur est survenue lors de l'inscription",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    setToast({
      message: "Vous avez été déconnecté",
      type: "info",
    })
  }

  // Fonction de récupération de mot de passe
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simuler une API de récupération de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email) {
        setToast({
          message: "Un code de vérification a été envoyé à votre adresse email",
          type: "success",
        })
        return true
      } else {
        setToast({
          message: "Veuillez fournir une adresse email valide",
          type: "error",
        })
        return false
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du mot de passe:", error)
      setToast({
        message: "Une erreur est survenue lors de la récupération du mot de passe",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de vérification OTP
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simuler une API de vérification OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Pour la démo, on accepte n'importe quel OTP à 6 chiffres
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        setToast({
          message: "Code de vérification validé",
          type: "success",
        })
        return true
      } else {
        setToast({
          message: "Code de vérification invalide",
          type: "error",
        })
        return false
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error)
      setToast({
        message: "Une erreur est survenue lors de la vérification du code",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simuler une API de réinitialisation de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (newPassword.length >= 6) {
        setToast({
          message: "Votre mot de passe a été réinitialisé avec succès",
          type: "success",
        })
        return true
      } else {
        setToast({
          message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
          type: "error",
        })
        return false
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error)
      setToast({
        message: "Une erreur est survenue lors de la réinitialisation du mot de passe",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fermer le toast après un délai
  const closeToast = () => {
    setToast(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}