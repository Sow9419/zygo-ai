"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AuthView } from "./auth-dialog"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card"
import Head from "next/head"

const registerSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onViewChange: (view: AuthView) => void
  onSuccess?: () => void
}

export function RegisterForm({ onViewChange, onSuccess }: RegisterFormProps) {
  const { register, signInWithGoogle, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null)
    try {
      const success = await register(data.email, data.password)
      
      if (success) {
        form.reset()
        // Stocker l'email dans sessionStorage pour la page de vérification OTP
        sessionStorage.setItem("verificationEmail", data.email)
        // Redirection automatique vers la page de vérification OTP
        window.location.href = "/auth/verifyotp"
        onSuccess?.() // Appeler le callback de succès si fourni
      }
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'inscription")
    }
  }
  // Fonction de connexion avec Google intégrée à Supabase
  const handleGoogleLogin = async () => {
    setError(null)
    const success = await signInWithGoogle()
    
    if (success) {
      // La redirection se fera automatiquement vers Google OAuth
      // puis vers notre callback après authentification
      onSuccess?.()
    }
  }

  return (
    <div className= {cn("flex  flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>Pour continuer la connexion entre votre email et mot de passe</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div className="grid gap-2">
                <FormField control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Votre email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}>                 
                </FormField>
              </div>
              <div className="grid gap-2">
                <FormField control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Votre mot de passe"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              </div>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="bg-blue-500 text-white w-full">
                {isLoading ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  </>
                ):("Créer un compte")}
              </Button>
              <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}>
              S'inscrire avec Google
              </Button>
              <div className="mt-4 text-center text-sm">
                <span>Vous avez déjà un compte?</span>
                <Button
                type="button"
                variant="link"
                className="ml-1 underline-offset-4 hover:underline"
                onClick={() => onViewChange("login")}
                >
                Se connecter
                </Button>
              </div>
           </form>
          </Form>          
          
        </CardContent>
      </Card>
    </div> 
  )
}