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

const verifyOTPSchema = z.object({
  otp: z.string().min(6, "Le code doit contenir 6 chiffres").max(6, "Le code doit contenir 6 chiffres").regex(/^\d+$/, "Le code doit contenir uniquement des chiffres"),
})

type VerifyOTPFormValues = z.infer<typeof verifyOTPSchema>

interface VerifyOTPFormProps {
  email: string
  onViewChange: (view: AuthView) => void
  onSuccess?: () => void
}

export function VerifyOTPForm({ email, onViewChange, onSuccess }: VerifyOTPFormProps) {
  const { verifyOTP, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<VerifyOTPFormValues>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async (data: VerifyOTPFormValues) => {
    setError(null)
    const success = await verifyOTP(email, data.otp)
    
    if (success) {
      // Passer à la vue de réinitialisation de mot de passe
      onViewChange("reset-password")
      onSuccess?.() // Appeler le callback de succès si fourni
    }
  }

  const handleResendCode = async () => {
    // Implémenter la logique pour renvoyer le code
    // Pour l'instant, on revient simplement à l'écran précédent
    onViewChange("forgot-password")
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Nous avons envoyé un code de vérification à <span className="font-medium">{email}</span>. 
        Veuillez entrer ce code pour continuer.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code de vérification</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123456" 
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
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
              variant="link" 
              className="px-0" 
              onClick={handleResendCode}
            >
              Renvoyer le code
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}