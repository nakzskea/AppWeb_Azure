// --- FICHIER: app/admin/login/page.tsx ---
// Page de connexion dédiée à l'administration

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

// Import de storeUser pour sauvegarder l'utilisateur
import { storeUser } from "@/lib/auth" 

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: "",
    mdp: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.email || !formData.mdp) {
      setError("L'email et le mot de passe sont requis.")
      setLoading(false)
      return
    }

    // --- APPEL À L'API DE CONNEXION ---
    try {
      const endpoint = '/api/auth/login';
      const bodyData = {
        email: formData.email,
        mdp: formData.mdp,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
         if (!data.user) throw new Error("Réponse API invalide.");

         // --- VÉRIFICATION ADMIN ---
         if (data.user.admin === 1) {
            // C'est un admin
            storeUser(data.user); // Stocke l'utilisateur
            router.push("/admin/dashboard"); // Redirige vers le dashboard
         } else {
            // C'est un client normal
            setError("Accès non autorisé. Vous n'êtes pas administrateur.");
         }
      } else {
         // Gérer les erreurs (ex: 401 Mot de passe incorrect)
         setError(data.error || "Échec de l'authentification.");
      }
      
    } catch (e) {
      console.error("Erreur lors de la soumission:", e);
      setError("Une erreur de réseau s'est produite.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        
        {/* Logo (Optionnel) */}
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">IT</span>
          </div>
          <span className="text-xl font-bold text-primary">InnovTech - Admin</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Accès Administrateur</CardTitle>
            <CardDescription>
              Veuillez vous connecter pour accéder au panneau de gestion.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mdp">Mot de passe</Label>
                <Input
                  id="mdp"
                  name="mdp"
                  type="password"
                  placeholder="••••••••"
                  value={formData.mdp}
                  onChange={handleChange}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Chargement..." : "Se connecter"}
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Retourner au site</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}