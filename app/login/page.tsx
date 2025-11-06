// --- FICHIER: app/login/page.tsx ---
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

// MODIFICATION: Import de storeUser pour sauvegarder l'utilisateur après le login
import { storeUser } from "@/lib/auth" 

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Les champs sont alignés sur la BDD (mdp, prenom, nom)
  const [formData, setFormData] = useState({
    email: "",
    mdp: "",
    prenom: "",
    nom: "",
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

    // Validation des champs
    if (!formData.email || !formData.mdp) {
      setError("L'email et le mot de passe sont requis.")
      setLoading(false)
      return
    }
    
    if (!isLogin && (!formData.prenom || !formData.nom)) {
      setError("Le prénom et le nom sont requis pour l'inscription.")
      setLoading(false)
      return
    }

    // --- ZONE DE LIAISON BDD: APPEL À L'API ---
    try {
      // Détermine quel endpoint appeler (login ou signup)
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      
      let bodyData: any = {
        email: formData.email,
        mdp: formData.mdp,
      };

      if (!isLogin) {
        bodyData = { ...bodyData, prenom: formData.prenom, nom: formData.nom };
      }

      // MODIFICATION: Appel 'fetch' implémenté
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
         if (isLogin) {
            // Connexion réussie
            if (!data.user) throw new Error("Réponse API invalide, utilisateur manquant.");
            storeUser(data.user); // Stocke l'utilisateur dans le localStorage
            router.push("/"); // Redirige vers l'accueil (ou /admin si admin)
         } else {
            // Inscription réussie
            setError("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
            setIsLogin(true); // Bascule vers l'écran de connexion
         }
      } else {
         // Gérer les erreurs de l'API (ex: 401, 409)
         setError(data.error || "Échec de l'opération.");
      }
      
    } catch (e) {
      console.error("Erreur lors de la soumission:", e);
      setError("Une erreur de réseau s'est produite.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? "Connexion" : "Créer un compte"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Connectez-vous pour accéder à votre compte"
                : "Créez un nouveau compte pour commencer vos achats"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className={`flex gap-2 p-3 rounded-lg ${
                  error.includes("succès") 
                    ? "bg-green-100 dark:bg-green-950 border-green-200" // Style succès
                    : "bg-destructive/10 border-destructive/20" // Style erreur
                }`}>
                  <AlertCircle className={`w-5 h-5 ${error.includes("succès") ? "text-green-600" : "text-destructive"} flex-shrink-0 mt-0.5`} />
                  <p className={`text-sm ${error.includes("succès") ? "text-green-700 dark:text-green-300" : "text-destructive"}`}>{error}</p>
                </div>
              )}

              {!isLogin && (
                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input id="prenom" name="prenom" placeholder="Votre prénom" value={formData.prenom} onChange={handleChange} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" name="nom" placeholder="Votre nom" value={formData.nom} onChange={handleChange} />
                    </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
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
                {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setFormData({ email: "", mdp: "", prenom: "", nom: "" }) 
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Pas encore de compte ? S'inscrire" : "Vous avez un compte ? Se connecter"}
              </button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Retourner à l'accueil</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}