"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useState } from "react"

const verifyOTPSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be at least 6 characters" }),
})

type VerifyOTPInputs = z.infer<typeof verifyOTPSchema>

interface VerifyOTPProps {
    email: string
    onSuccess: () => void
}

export default function verifyOTP({email, onSuccess}: VerifyOTPProps) {
    const { verifyOTP } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const[error, setError] = useState<string | null>(null)
    const form = useForm<VerifyOTPInputs>({
        resolver: zodResolver(verifyOTPSchema),
        defaultValues: {
            otp: "",
        }
    })

    const onSubmit = async (data: VerifyOTPInputs) => {
        setError(null)
        const success = await verifyOTP(email, data.otp)

        if (success) {
           // Passer à la vue de réinitialisation de mot de passe
           onSuccess()
    }
} 

const handleResendCode = async () => {
    // Gérer l'envoi du code de vérification à nouveau
    // Implémenter la logique pour renvoyer le code
    // Pour l'instant, on revient simplement à l'écran précédent
}
const handleSignUp = () => {
    // Gérer la navigation vers la page d'inscription
    window.location.href = '/auth/signup'
}
const handleBackToLogin = () => {
    // Gérer la navigation vers la page de connexion
    window.history.back()
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
          <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier"
              )}
            </Button>
          <Button 
              type="button" 
              variant="link" 
              className="w-full" 
              onClick={handleResendCode}
            >
              Renvoyer le code
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