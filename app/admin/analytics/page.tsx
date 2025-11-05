"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser } from "@/lib/auth"
import { mockOrders, mockProducts } from "@/lib/mock-data"
import { TrendingUp, Calendar, ShoppingCart, DollarSign } from "lucide-react"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser || storedUser.role !== "admin") {
      router.push("/admin/login")
      return
    }
    setUser(storedUser)
  }, [router])

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = mockOrders.length
  const avgOrderValue = totalRevenue / (totalOrders || 1)
  const deliveredOrders = mockOrders.filter((o) => o.status === "delivered").length
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length

  // Calculate monthly data for visualization
  const ordersByStatus = {
    delivered: deliveredOrders,
    pending: pendingOrders,
  }

  const topProducts = mockProducts.sort((a, b) => b.price - a.price).slice(0, 5)

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Ventes & Analytiques</h1>
            <p className="text-muted-foreground mt-1">Vue d'ensemble des performances de vente</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Depuis le début</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${avgOrderValue.toFixed(2)}</div>
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
                  {totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Commandes livrées</p>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Status */}
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
                      <p className="font-bold text-foreground">{deliveredOrders}</p>
                      <p className="text-xs text-muted-foreground">
                        {totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                      <span className="text-sm text-foreground font-medium">En attente</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{pendingOrders}</p>
                      <p className="text-xs text-muted-foreground">
                        {totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0}%
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
                        width: `${totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0}%`,
                      }}
                    ></div>
                    <div
                      className="bg-amber-600"
                      style={{
                        width: `${totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0}%`,
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
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${product.price}</p>
                        <p className="text-xs text-muted-foreground">{product.stock} stock</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <th className="text-left py-3 px-4 font-semibold text-foreground">ID Commande</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Articles</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Montant</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 font-semibold text-foreground">{order.id}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {new Date(order.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 px-4 text-foreground">{order.items}</td>
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
