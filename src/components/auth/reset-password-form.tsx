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

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "Veuillez confirmer votre mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
  email: string
  onViewChange: (view: AuthView) => void
  onSuccess?: () => void
}

export function ResetPasswordForm({ email, onViewChange, onSuccess }: ResetPasswordFormProps) {
  const { resetPassword, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [otp, setOtp] = useState<string>("123456") // Dans un cas réel, cela viendrait de l'étape précédente

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError(null)
    const success = await resetPassword(email, otp, data.password)
    
    if (success) {
      // Rediriger vers la page de connexion après réinitialisation réussie
      onViewChange("login")
      onSuccess?.() // Appeler le callback de succès si fourni
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Créez un nouveau mot de passe pour votre compte <span className="font-medium">{email}</span>.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nouveau mot de passe</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    autoComplete="new-password"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    autoComplete="new-password"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réinitialisation...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}