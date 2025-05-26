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

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onViewChange: (view: AuthView) => void
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onViewChange, onSuccess, className }: LoginFormProps) {
  const { login, signInWithGoogle, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    const success = await login(data.email, data.password)
    
    if (success) {
      form.reset()
      onSuccess?.() // Appeler le callback de succès si fourni
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
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input 
                          id="email"
                          placeholder="m@example.com" 
                          type="email" 
                          autoComplete="email"
                          required
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Button 
                          type="button" 
                          variant="link" 
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline" 
                          onClick={() => window.location.href = '/auth/forgopassword'}
                        >
                          Forgot your password?
                        </Button>
                      </div>
                      <FormControl>
                        <Input 
                          id="password"
                          placeholder="••••••••" 
                          type="password" 
                          autoComplete="current-password"
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
               
               <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Login...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                Login with Google
              </Button>
              
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button 
                  type="button"
                  variant="link" 
                  className="underline underline-offset-4" 
                  onClick={() => onViewChange("register")}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}