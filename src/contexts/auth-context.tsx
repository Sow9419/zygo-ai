"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { Toast } from "@/components/core/toast"

// Interface utilisateur étendue avec les données Supabase
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  emailConfirmed?: boolean
  phone?: string
  lastSignIn?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<boolean>
  verifyOTP: (email: string, otp: string) => Promise<boolean>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>
  signInWithGoogle: () => Promise<boolean>
  resendConfirmation: (email: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null)
  const supabase = createClient()

  // Fonction utilitaire pour convertir un utilisateur Supabase en User local
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
      avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
      emailConfirmed: supabaseUser.email_confirmed_at !== null,
      phone: supabaseUser.phone,
      lastSignIn: supabaseUser.last_sign_in_at
    }
  }

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Récupérer la session actuelle depuis Supabase
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error)
          setUser(null)
        } else if (session?.user) {
          setUser(mapSupabaseUser(session.user))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        
        if (session?.user) {
          setUser(mapSupabaseUser(session.user))
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    // Nettoyer l'abonnement lors du démontage
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Fonction de connexion avec Supabase
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Validation des entrées côté client
      if (!email || !password) {
        setToast({
          message: "Veuillez remplir tous les champs",
          type: "error",
        })
        return false
      }

      // Connexion avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      })

      if (error) {
        console.error('Erreur de connexion:', error)
        
        // Gestion des erreurs spécifiques
        let errorMessage = "Une erreur est survenue lors de la connexion"
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect"
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter"
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard"
        }
        
        setToast({
          message: errorMessage,
          type: "error",
        })
        return false
      }

      if (data.user) {
        setToast({
          message: "Connexion réussie",
          type: "success",
        })
        return true
      }

      return false
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setToast({
        message: "Une erreur inattendue est survenue",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction d'inscription avec Supabase
  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Validation des entrées côté client
      if (!email || !password) {
        setToast({
          message: "Veuillez remplir tous les champs",
          type: "error",
        })
        return false
      }

      if (password.length < 6) {
        setToast({
          message: "Le mot de passe doit contenir au moins 6 caractères",
          type: "error",
        })
        return false
      }

      // Inscription avec Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
            name: name || email.split('@')[0]
          }
        }
      })

      if (error) {
        console.error('Erreur d\'inscription:', error)
        
        // Gestion des erreurs spécifiques
        let errorMessage = "Une erreur est survenue lors de l'inscription"
        
        if (error.message.includes('User already registered')) {
          errorMessage = "Un compte avec cet email existe déjà"
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères"
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "Adresse email invalide"
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = "Les inscriptions sont temporairement désactivées"
        }
        
        setToast({
          message: errorMessage,
          type: "error",
        })
        return false
      }

      if (data.user) {
        // Vérifier si l'email doit être confirmé
        if (!data.session) {
          setToast({
            message: "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte",
            type: "success",
          })
        } else {
          setToast({
            message: "Inscription réussie ! Vous êtes maintenant connecté",
            type: "success",
          })
        }
        return true
      }

      return false
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setToast({
        message: "Une erreur inattendue est survenue",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de déconnexion avec Supabase
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erreur lors de la déconnexion:', error)
        setToast({
          message: "Erreur lors de la déconnexion",
          type: "error",
        })
      } else {
        setUser(null)
        setToast({
          message: "Vous avez été déconnecté avec succès",
          type: "info",
        })
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      setToast({
        message: "Une erreur inattendue est survenue",
        type: "error",
      })
    }
  }

  // Fonction de récupération de mot de passe avec Supabase
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Validation de l'email
      if (!email || !email.includes('@')) {
        setToast({
          message: "Veuillez fournir une adresse email valide",
          type: "error",
        })
        return false
      }

      // Envoyer l'email de réinitialisation avec Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/resetpassword`,
        }
      )

      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error)
        
        let errorMessage = "Une erreur est survenue lors de l'envoi de l'email"
        
        if (error.message.includes('User not found')) {
          errorMessage = "Aucun compte associé à cette adresse email"
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = "Trop de demandes. Veuillez attendre avant de réessayer"
        }
        
        setToast({
          message: errorMessage,
          type: "error",
        })
        return false
      }

      setToast({
        message: "Un lien de réinitialisation a été envoyé à votre adresse email",
        type: "success",
      })
      return true
    } catch (error) {
      console.error("Erreur lors de la récupération du mot de passe:", error)
      setToast({
        message: "Une erreur inattendue est survenue",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de vérification OTP avec Supabase
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Validation des entrées
      if (!email || !otp) {
        setToast({
          message: "Email et code de vérification requis",
          type: "error",
        })
        return false
      }

      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        setToast({
          message: "Le code de vérification doit contenir 6 chiffres",
          type: "error",
        })
        return false
      }

      // Vérifier l'OTP avec Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp,
        type: 'signup'
      })

      if (error) {
        console.error('Erreur lors de la vérification OTP:', error)
        
        let errorMessage = "Code de vérification invalide"
        
        if (error.message.includes('Token has expired')) {
          errorMessage = "Le code de vérification a expiré. Demandez un nouveau code"
        } else if (error.message.includes('Invalid token')) {
          errorMessage = "Code de vérification invalide"
        }
        
        setToast({
          message: errorMessage,
          type: "error",
        })
        return false
      }

      if (data.user) {
        setToast({
          message: "Code de vérification validé avec succès",
          type: "success",
        })
        return true
      }

      return false
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error)
      setToast({
        message: "Une erreur inattendue est survenue",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de réinitialisation de mot de passe avec Supabase
  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Validation des entrées
      if (!email || !otp || !newPassword) {
        setToast({
          message: "Tous les champs sont requis",
          type: "error",
        })
        return false
      }

      if (newPassword.length < 6) {
        setToast({
          message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
          type: "error",
        })
        return false
      }

      // Vérifier l'OTP et réinitialiser le mot de passe avec Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp,
        type: 'recovery'
      })

      if (error) {
        console.error('Erreur lors de la vérification OTP pour reset:', error)
        setToast({
          message: "Code de vérification invalide ou expiré",
          type: "error",
        })
        return false
      }

      if (data.session) {
        // Mettre à jour le mot de passe
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword
        })

        if (updateError) {
          console.error('Erreur lors de la mise à jour du mot de passe:', updateError)
          setToast({
            message: "Erreur lors de la mise à jour du mot de passe",
            type: "error",
          })
          return false
        }

        setToast({
          message: "Votre mot de passe a été réinitialisé avec succès",
          type: "success",
        })
        return true
      }

      return false
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error)
      setToast({
        message: "Une erreur inattendue est survenue",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de connexion avec Google
  const signInWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })

      if (error) {
        console.error('Erreur lors de la connexion Google:', error)
        setToast({
          message: "Erreur lors de la connexion avec Google",
          type: "error",
        })
        return false
      }

      // La redirection se fera automatiquement
      return true
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error)
      setToast({
        message: "Une erreur inattendue est survenue",
        type: "error",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour renvoyer l'email de confirmation
  const resendConfirmation = async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      if (!email || !email.includes('@')) {
        setToast({
          message: "Adresse email invalide",
          type: "error",
        })
        return false
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Erreur lors du renvoi de confirmation:', error)
        
        let errorMessage = "Erreur lors du renvoi de l'email de confirmation"
        
        if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = "Trop de demandes. Veuillez attendre avant de réessayer"
        }
        
        setToast({
          message: errorMessage,
          type: "error",
        })
        return false
      }

      setToast({
        message: "Email de confirmation renvoyé avec succès",
        type: "success",
      })
      return true
    } catch (error) {
      console.error('Erreur lors du renvoi de confirmation:', error)
      setToast({
        message: "Une erreur inattendue est survenue",
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
        signInWithGoogle,
        resendConfirmation
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