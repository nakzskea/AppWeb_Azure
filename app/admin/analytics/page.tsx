// --- FICHIER: app/admin/analytics/page.tsx ---
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Assurez-vous d'importer l'interface AuthUser correcte et isAdminUser
import { getStoredUser, isAdminUser } from "@/lib/auth" 
import { TrendingUp, Calendar, ShoppingCart, DollarSign } from "lucide-react"

// Importation des interfaces BDD pour les tableaux (Produit et Vente)
import type { Produit, Vente } from "@/lib/mock-data"

// MODIFICATION: Interfaces pour les données d'analyse spécifiques
interface AnalyticsProduct extends Produit {
  // Le backend devra agréger et peut ajouter des champs comme total_sales ou total_revenue ici
  ventes_count: number // Nombre de ventes ou quantité totale vendue
}

interface AnalyticsOrder {
  id_vente: number | string // Correspond à id_vente (peut être l'ID de la commande agrégée)
  date_vente: string // Correspond à date_vente
  total: number // Montant total de la commande (calculé)
  articles_count: number // Nombre total d'articles dans la commande
  status: "delivered" | "pending" // Champ dérivé (basé sur la logique backend)
}

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  deliveredOrders: number
  pendingOrders: number
  // Utilisation des types BDD mis à jour
  topProducts: AnalyticsProduct[] 
  recentOrders: AnalyticsOrder[] 
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  // L'interface 'any' peut être remplacée par AuthUser | null si importé
  const [user, setUser] = useState<any>(null) 
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    topProducts: [],
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

    // ZONE DE LIAISON BDD: Récupérer les données analytiques depuis la BDD
    // GET /api/admin/analytics
    // Les données renvoyées DOIVENT utiliser les noms de champs alignés sur Produit et Vente.

    const fetchAnalytics = async () => {
      try {
        // const response = await fetch('/api/admin/analytics');
        // const data: AnalyticsData = await response.json();
        // setAnalytics(data);
        
        // Simulation des données BDD pour la démo
        setAnalytics({
          totalRevenue: 15456.75,
          totalOrders: 145,
          avgOrderValue: 106.60,
          deliveredOrders: 120,
          pendingOrders: 25,
          topProducts: [
            // Utilisation des champs de l'interface Produit
            { id_produits: 1, id_categorie: 1, nom_produit: "Pro Laptop Stand", prix: 89.99, quantite: 45, description: "...", image_url: "...", ventes_count: 50 },
            { id_produits: 2, id_categorie: 2, nom_produit: "4K USB Webcam", prix: 159.99, quantite: 28, description: "...", image_url: "...", ventes_count: 35 },
            // ... autres produits ...
          ] as AnalyticsProduct[],
          recentOrders: [
            // Utilisation des champs alignés sur Vente
            { id_vente: "V-0050", date_vente: "2025-11-05", articles_count: 2, total: 199.98, status: "pending" },
            { id_vente: "V-0049", date_vente: "2025-11-04", articles_count: 1, total: 89.99, status: "delivered" },
            // ... autres commandes ...
          ] as AnalyticsOrder[],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [router])

  if (!user || loading) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Ventes & Analytiques</h1>
            <p className="text-muted-foreground mt-1">Vue d'overview des performances de vente</p>
          </div>

          {/* KPI Cards (Aucun changement nécessaire car ils utilisent les champs agrégés) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* ... (Contenu inchangé) ... */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${analytics.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Depuis le début</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{analytics.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${analytics.avgOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Par commande</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux Livraison</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {analytics.totalOrders > 0
                    ? Math.round((analytics.deliveredOrders / analytics.totalOrders) * 100)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">Commandes livrées</p>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Status (Contenu inchangé) */}
            <Card>
              <CardHeader>
                <CardTitle>Statut des Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-sm text-foreground font-medium">Livrées</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{analytics.deliveredOrders}</p>
                      <p className="text-xs text-muted-foreground">
                        {analytics.totalOrders > 0
                          ? Math.round((analytics.deliveredOrders / analytics.totalOrders) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                      <span className="text-sm text-foreground font-medium">En attente</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{analytics.pendingOrders}</p>
                      <p className="text-xs text-muted-foreground">
                        {analytics.totalOrders > 0
                          ? Math.round((analytics.pendingOrders / analytics.totalOrders) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status bar visualization */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Distribution</p>
                  <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-muted">
                    <div
                      className="bg-green-600"
                      style={{
                        width: `${analytics.totalOrders > 0 ? (analytics.deliveredOrders / analytics.totalOrders) * 100 : 0}%`,
                      }}
                    ></div>
                    <div
                      className="bg-amber-600"
                      style={{
                        width: `${analytics.totalOrders > 0 ? (analytics.pendingOrders / analytics.totalOrders) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Produits Haut de Gamme</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun produit</p>
                ) : (
                  <div className="space-y-3">
                    {/* MODIFICATION: Itération sur les champs BDD Produit */}
                    {analytics.topProducts.map((product: AnalyticsProduct, index: number) => (
                      <div
                        // Utilise id_produits comme clé
                        key={product.id_produits} 
                        className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            {/* Utilise nom_produit */}
                            <p className="text-sm font-medium text-foreground">{product.nom_produit}</p>
                            {/* Utilise id_categorie (ou nom_categorie si jointure) */}
                            <p className="text-xs text-muted-foreground">Catégorie ID: {product.id_categorie}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {/* Utilise prix et quantite (stock) */}
                          <p className="font-bold text-primary">${product.prix.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{product.quantite} en stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {/* MODIFICATION: Titre de colonne aligné BDD */}
                      <th className="text-left py-3 px-4 font-semibold text-foreground">ID Vente</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Articles</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Montant</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* MODIFICATION: Itération sur les champs BDD Vente */}
                    {analytics.recentOrders.map((order: AnalyticsOrder) => (
                      <tr key={order.id_vente} className="border-b border-border hover:bg-muted/50 transition">
                        {/* Utilise id_vente */}
                        <td className="py-3 px-4 font-semibold text-foreground">{order.id_vente}</td>
                        {/* Utilise date_vente */}
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {new Date(order.date_vente).toLocaleDateString("fr-FR")}
                        </td>
                        {/* Utilise articles_count */}
                        <td className="py-3 px-4 text-foreground">{order.articles_count}</td>
                        {/* Utilise total */}
                        <td className="py-3 px-4 font-bold text-primary">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                            }`}
                          >
                            {order.status === "delivered" ? "Livré" : "En attente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}