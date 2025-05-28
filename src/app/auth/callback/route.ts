import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Si une erreur est présente dans les paramètres de requête
  if (error) {
    console.error('Erreur OAuth:', error, error_description)
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(
        error_description || 'Erreur lors de l\'authentification'
      )}`
    )
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    try {
      // Échange du code contre une session
      const { error, data } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Erreur lors de l\'échange du code:', error)
        // Rediriger vers la page de connexion avec un message d'erreur
        return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`)
      }

      console.log('Authentification OAuth réussie, redirection vers la page principale')
      // Rediriger vers la page d'accueil après une authentification réussie
      return NextResponse.redirect(origin)
    } catch (err) {
      console.error('Erreur inattendue lors du callback OAuth:', err)
      return NextResponse.redirect(`${origin}/auth/login?error=unexpected_error`)
    }
  }

  // Si aucun code n'est présent, rediriger vers la page de connexion
  console.warn('Aucun code OAuth fourni dans la requête')
  return NextResponse.redirect(`${origin}/auth/login?error=no_code_provided`)
}