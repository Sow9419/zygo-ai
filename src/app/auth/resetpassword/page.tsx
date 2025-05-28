"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const ResetPasswordSchema = z.object({
    password: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule" })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})
type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)
    const supabase = createClient()

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const onsubmit = async (values: ResetPasswordInput) => {
        setIsLoading(true)
        setError("")
        try {
            // L'utilisateur est déjà authentifié temporairement grâce au lien magique
            const { error: updateError } = await supabase.auth.updateUser({
                password: values.password
            })
            if (updateError) {
                setError(updateError.message || "Erreur lors de la mise à jour du mot de passe")
                setIsLoading(false)
                return
            }
            setSuccess(true)
            setTimeout(() => {
                window.location.href = "/"
            }, 1500)
        } catch (err: any) {
            setError(err.message || "Une erreur inattendue s'est produite. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* HEADER */}
            <header className="w-full border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">L</span>
                                </div>
                                <span className="ml-2 text-xl font-semibold text-gray-900">Logo</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                                Contact
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            {/* MAIN */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white p-8 ">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Réinitialisation du mot de passe
                            </h2>
                            <p className="text-gray-600">
                                Créez un nouveau mot de passe pour votre compte.
                            </p>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
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
                                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                                En cours...
                                            </>
                                        ) : (
                                            "Réinitialiser le mot de passe"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.location.href = "/"}
                                        disabled={isLoading}
                                    >
                                        Retour à la connexion
                                    </Button>
                                    {success && (
                                        <div className="bg-green-50 text-green-700 p-3 rounded-md mt-2">
                                            <p className="text-sm font-medium">Mot de passe réinitialisé avec succès !</p>
                                            <p className="text-xs">Vous allez être redirigé...</p>
                                        </div>
                                    )}

                                    <div className="bg-muted p-3 rounded-md mb-4">
                                        <h4 className="text-sm font-medium mb-2">Exigences du mot de passe :</h4>
                                        <ul className="text-xs space-y-1 pl-4">
                                         {form.watch("password") ? (
                                            <>
                                            <li className="flex items-center">
                                                {form.watch("password").length >= 8 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                Minimum 8 caractères
                                            </li>
                                            <li className="flex items-center">
                                                {/[a-z]/.test(form.watch("password")) ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                Au moins une lettre minuscule
                                            </li>
                                            <li className="flex items-center">
                                                {/[A-Z]/.test(form.watch("password")) ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                Au moins une lettre majuscule
                                            </li>
                                            <li className="flex items-center">
                                                {/[0-9]/.test(form.watch("password")) ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                Au moins un chiffre
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Minimum 8 caractères
                                            </li>
                                            <li className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Au moins une lettre minuscule
                                            </li>
                                            <li className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Au moins une lettre majuscule
                                            </li>
                                            <li className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Au moins un chiffre
                                            </li>
                                        </>
                                    )}
                                </ul>
                                </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </main>
            {/* FOOTER */}
            <footer className="w-full border-t border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-500">
                            © 2025 Votre Entreprise. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}