// --- FICHIER: app/admin/dashboard/page.tsx ---
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Importation des fonctions de vérification d'administrateur
import { getStoredUser, isAdminUser } from "@/lib/auth" 
import { Package, Users, TrendingUp, ShoppingCart } from "lucide-react"

// Importation des types BDD pour les affichages
import type { Produit, Vente } from "@/lib/mock-data"

// MODIFICATION: Interface pour les produits récents
interface RecentProduct extends Produit {
  // Le backend peut ne pas renvoyer tous les champs de Produit,
  // mais au moins ceux-ci sont nécessaires pour l'affichage :
  id_produits: number
  nom_produit: string
  prix: number
  quantite: number // Stock
}

// MODIFICATION: Interface pour les commandes récentes (Ventes agrégées)
interface RecentOrder {
  id_vente: number | string // Correspond à id_vente
  date_vente: string // Correspond à date_vente
  total: number // Montant total (calculé par le backend)
}

// MODIFICATION: Interface des métriques utilisant les types BDD
interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  activeUsers: number
  recentProducts: RecentProduct[] // Utilisation du type BDD
  recentOrders: RecentOrder[] // Utilisation du type BDD
}

export default function AdminDashboard() {
  const router = useRouter()
  // L'interface 'any' peut être remplacée par AuthUser | null si importé
  const [user, setUser] = useState<any>(null) 
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeUsers: 0,
    recentProducts: [],
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    // MODIFICATION: Vérification d'administration en utilisant isAdminUser et le flag 'admin' (0 ou 1)
    if (!storedUser || !isAdminUser(storedUser)) { 
      router.push("/admin/login")
      return
    }
    setUser(storedUser)

    // ZONE DE LIAISON BDD: Récupérer les métriques du tableau de bord depuis la BDD
    // GET /api/admin/dashboard (doit renvoyer des champs BDD alignés)

    const fetchMetrics = async () => {
      try {
        // const response = await fetch('/api/admin/dashboard');
        // const data: DashboardMetrics = await response.json();
        // setMetrics(data);
        
        // Simulation des données alignées BDD pour la démo
        setMetrics({
          totalRevenue: 12500.50,
          totalOrders: 110,
          totalProducts: 25, // Nombre de lignes dans Produits
          activeUsers: 85, // Nombre d'utilisateurs avec admin=0
          recentProducts: [
            // Utilisation de nom_produit, prix, quantite, id_produits
            { id_produits: 10, nom_produit: "Nouveau Câble USB-C", prix: 19.99, quantite: 150, image_url: "..." } as RecentProduct,
            { id_produits: 9, nom_produit: "Écran 32 pouces Pro", prix: 499.99, quantite: 5, image_url: "..." } as RecentProduct,
            { id_produits: 8, nom_produit: "Kit de Nettoyage", prix: 9.99, quantite: 300, image_url: "..." } as RecentProduct,
          ],
          recentOrders: [
            // Utilisation de id_vente, date_vente, total
            { id_vente: "V-0110", date_vente: "2025-11-04T15:00:00Z", total: 145.00 },
            { id_vente: "V-0109", date_vente: "2025-11-04T10:30:00Z", total: 89.99 },
            { id_vente: "V-0108", date_vente: "2025-11-03T18:45:00Z", total: 349.97 },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [router])

  if (!user || loading) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
            {/* MODIFICATION: user.name n'existe plus, on utilise user.prenom et user.nom */}
            <p className="text-muted-foreground mt-1">Bienvenue, {user.prenom} {user.nom}</p> 
          </div>

          {/* KPI Cards (Aucun changement majeur ici car ils utilisent des métriques agrégées) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${metrics.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">{metrics.totalOrders} commandes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits</CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{metrics.totalProducts}</div>
                {/* MODIFICATION: Utilisation de metrics.totalProducts (aligné sur Produit) */}
                <p className="text-xs text-muted-foreground mt-1">En stock total</p> 
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* MODIFICATION: Utilisation de metrics.activeUsers (aligné sur Utilisateurs) */}
                <div className="text-2xl font-bold text-primary">{metrics.activeUsers}</div> 
                <p className="text-xs text-muted-foreground mt-1">Clients actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{metrics.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Total depuis le début</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produits récents</CardTitle>
                <CardDescription>Les 3 derniers produits ajoutés</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.recentProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun produit récent</p>
                ) : (
                  <div className="space-y-3">
                    {/* MODIFICATION: Itération sur les champs BDD de Produit */}
                    {metrics.recentProducts.map((product: RecentProduct) => (
                      <div
                        // Utilise id_produits comme clé
                        key={product.id_produits} 
                        className="flex justify-between items-center pb-3 border-b border-border last:border-0 last:pb-0"
                      >
                        <div>
                          {/* Utilise nom_produit */}
                          <p className="font-medium text-foreground text-sm">{product.nom_produit}</p> 
                          {/* Utilise prix */}
                          <p className="text-xs text-muted-foreground">${product.prix.toFixed(2)}</p> 
                        </div>
                        {/* Utilise quantite pour le stock */}
                        <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded">
                          {product.quantite} en stock 
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Les 3 dernières commandes</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.recentOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune commande récente</p>
                ) : (
                  <div className="space-y-3">
                    {/* MODIFICATION: Itération sur les champs BDD de Vente */}
                    {metrics.recentOrders.map((order: RecentOrder) => (
                      <div
                        // Utilise id_vente comme clé
                        key={order.id_vente} 
                        className="flex justify-between items-center pb-3 border-b border-border last:border-0 last:pb-0"
                      >
                        <div>
                          {/* Utilise id_vente */}
                          <p className="font-medium text-foreground text-sm">Commande #{order.id_vente}</p> 
                          {/* Utilise date_vente */}
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.date_vente).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        {/* Utilise total */}
                        <span className="text-sm font-bold text-primary">${order.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}