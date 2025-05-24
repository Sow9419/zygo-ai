# Composants d'Authentification

Ce dossier contient tous les composants nécessaires pour implémenter un système d'authentification complet dans l'application Zygo AI.

## Composants disponibles

- `AuthDialog` : Composant principal qui gère l'affichage des différents formulaires d'authentification dans une boîte de dialogue modale.
- `LoginForm` : Formulaire de connexion.
- `RegisterForm` : Formulaire d'inscription.
- `ForgotPasswordForm` : Formulaire de récupération de mot de passe.
- `VerifyOTPForm` : Formulaire de vérification du code OTP.
- `ResetPasswordForm` : Formulaire de réinitialisation du mot de passe.

## Contexte d'authentification

Tous ces composants utilisent le contexte d'authentification (`AuthContext`) qui doit être fourni au niveau supérieur de l'application. Ce contexte gère l'état d'authentification de l'utilisateur et fournit les méthodes nécessaires pour les opérations d'authentification.

## Exemple d'utilisation

### 1. Ajouter le fournisseur de contexte d'authentification

Dans votre fichier `layout.tsx` ou équivalent :

```tsx
import { AuthProvider } from "@/contexts/auth-context"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Utiliser le composant AuthDialog

Dans n'importe quel composant où vous souhaitez afficher le dialogue d'authentification :

```tsx
import { AuthDialog } from "@/components/auth"

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="logo">Zygo AI</div>
      <nav>
        {/* Autres éléments de navigation */}
        <AuthDialog />
      </nav>
    </header>
  )
}
```

### 3. Accéder à l'état d'authentification

Pour accéder à l'état d'authentification dans n'importe quel composant :

```tsx
import { useAuth } from "@/contexts/auth-context"

export function ProfileButton() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return null
  }
  
  return (
    <div className="flex items-center gap-2">
      <span>Bonjour, {user?.name || user?.email}</span>
      <button onClick={logout}>Déconnexion</button>
    </div>
  )
}
```

## Intégration avec Supabase

Pour intégrer Supabase, vous devrez modifier le fichier `auth-context.tsx` pour remplacer les fonctions simulées par des appels à l'API Supabase. Les composants d'interface utilisateur n'auront pas besoin d'être modifiés tant que les signatures des fonctions restent les mêmes.