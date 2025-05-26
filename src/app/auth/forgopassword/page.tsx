"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const {forgotPassword} = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<boolean>(false)
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)
      const result = await forgotPassword(data.email)
      if (result) {
        // Message de succès
        setSuccess(true)
        form.reset() // Réinitialiser le formulaire après succès
      } else {
        setError('Erreur lors de l\'envoi de l\'email de réinitialisation')
      }
    } catch (err: any) {
      console.error('Erreur de réinitialisation:', err)
      setError(err?.message || 'Une erreur est survenue lors de la demande de réinitialisation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    // Navigation vers la page de connexion
    window.history.back()
  }

  const handleSignUp = () => {
    // Navigation vers la page d'inscription
    window.location.href = '/auth/signup'
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER SECTION - Navigation avec logo et boutons */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo à gauche */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">Logo</span>
              </div>
            </div>
            
            {/* Boutons à droite */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                Contact
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN SECTION - Contenu principal centré */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className=" max-w-md w-full space-y-8">
        {/*container de formulaire*/}
        <div className="bg-white p-8">
            {/* Titre de la page */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Mot de passe oublié
              </h2>
              <p className="text-gray-600">
                Entrez votre adresse email pour recevoir un lien de réinitialisation
              </p>
            </div>
            {/* Formulaire de réinitialisation */}
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
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                Un email de réinitialisation a été envoyé à votre adresse email. 
                Veuillez vérifier votre boîte de réception et suivre les instructions.
              </p>
            </div>
          )}
          <Button 
          type="submit"
          className="w-full" 
          disabled={isLoading || success}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : success ? (
                "Email envoyé"
              ) : (
                "Envoyer le code"
              )}
            </Button>
          <Button 
              type="button" 
              variant="outline" 
              onClick={handleBackToLogin}
              className="w-full"
            >
              Retour
            </Button>        
        </form>
      </Form>
    </div>
</div>
</main>

{/* FOOTER SECTION - Pied de page avec message d'inscription */}
<footer className="w-full border-t border-gray-200 bg-gray-50">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
       ">
        {/* Message d'inscription centré */}
          <div className="text-center">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <button 
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                onClick={handleSignUp}
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}