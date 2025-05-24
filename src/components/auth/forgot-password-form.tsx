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

const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  onViewChange: (view: AuthView) => void
  onEmailCapture: (email: string) => void
  onSuccess?: () => void
}

export function ForgotPasswordForm({ 
  onViewChange, 
  onEmailCapture, 
  onSuccess 
}: ForgotPasswordFormProps) {
  const { forgotPassword, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null)
    const success = await forgotPassword(data.email)
    
    if (success) {
      // Capturer l'email pour les étapes suivantes
      onEmailCapture(data.email)
      // Passer à la vue de vérification OTP
      onViewChange("verify-otp")
      onSuccess?.() // Appeler le callback de succès si fourni
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Entrez votre adresse email et nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="votre@email.com" 
                    type="email" 
                    autoComplete="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <div className="flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onViewChange("login")}
            >
              Retour
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer le code"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}