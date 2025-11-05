// --- FICHIER: app/account/page.tsx ---
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Package, UserIcon, CreditCard } from "lucide-react"

// MODIFICATION: Interface Vente alignée sur la BDD
// Bien que la table Vente stocke des lignes individuelles, cette interface
// représente une "commande" agrégée pour l'affichage.
interface Vente {
  id_vente: number | string // Correspond à id_vente
  date_vente: string // Correspond à date_vente
  total: number // Champ dérivé (total de la commande)
  status: "delivered" | "pending" // Champ dérivé (état de la commande)
}

// MODIFICATION: Interface Utilisateur alignée sur la BDD
interface Utilisateur {
  id_user: number | string // Correspond à id_user
  prenom: string // Correspond à prenom
  nom: string // Correspond à nom
  email: string
}

export default function AccountPage() {
  const router = useRouter()
  // Utilisation des nouvelles interfaces
  const [user, setUser] = useState<Utilisateur | null>(null)
  const [userOrders, setUserOrders] = useState<Vente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ZONE DE LIAISON BDD: Récupérer l'utilisateur courant
        /*
        const currentUser = await fetchCurrentUser(); // GET /api/auth/me
        if (!currentUser) {
            router.push("/login");
            return;
        }
        setUser(currentUser);
        */

        // ZONE DE LIAISON BDD: Récupérer l'historique des commandes (Ventes)
        // Les Ventes devront être agrégées par "commande" si votre backend les renvoie ligne par ligne.
        // GET /api/ventes?id_user={id_user}
        // const orders = await fetchUserVentes(currentUser.id_user); 
        // setUserOrders(orders);
        
        // Placeholder implementation
        // setUser({ id_user: 1, prenom: "Alice", nom: "Dupont", email: "alice@example.com" });
        // setUserOrders([
        //   { id_vente: "V-001", date_vente: "2024-10-15", total: 349.97, status: "delivered" },
        //   { id_vente: "V-002", date_vente: "2024-09-08", total: 89.99, status: "pending" },
        // ]);
        
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    // ZONE DE LIAISON BDD: Appeler l'API de déconnexion
    // N'oubliez pas d'importer et d'appeler `logoutUser()` si vous l'avez implémenté dans auth.ts
    // await logoutUser(); // POST /api/auth/logout
    router.push("/")
  }

  if (loading) return null

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">Vous n'êtes pas connecté.</p>
          <Button asChild>
            <Link href="/login">Aller à la connexion</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mon Compte</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* MODIFICATION: Affichage du prénom et du nom */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prénom Nom</p>
                <p className="font-semibold text-foreground">{user.prenom} {user.nom}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold text-foreground">{user.email}</p>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/account/edit">Modifier le profil</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="w-5 h-5" />
                Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{userOrders.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Dépensé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                ${userOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Au total</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des commandes</CardTitle>
            <CardDescription>
              {userOrders.length === 0
                ? "Vous n'avez pas encore passé de commande"
                : `Vous avez ${userOrders.length} commande${userOrders.length > 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">Commencez vos achats pour voir votre historique</p>
                <Button asChild>
                  <Link href="/">Voir les produits</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* ZONE DE LIAISON BDD: Itération sur l'historique des commandes */}
                {userOrders.map((order) => (
                  <div
                    key={order.id_vente} // Utilisation de id_vente comme clé
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      {/* Affichage de id_vente */}
                      <h4 className="font-semibold text-foreground">Commande #{order.id_vente}</h4>
                      <p className="text-sm text-muted-foreground">
                        {/* Utilisation de date_vente */}
                        {new Date(order.date_vente).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${order.total.toFixed(2)}</p>
                      <p
                        className={`text-sm ${
                          order.status === "delivered" ? "text-green-600 font-medium" : "text-amber-600 font-medium"
                        }`}
                      >
                        {order.status === "delivered" ? "Livré" : "En attente"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}