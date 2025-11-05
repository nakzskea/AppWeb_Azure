"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser } from "@/lib/auth"
import { mockUsers, type User } from "@/lib/mock-data"
import { Shield, Users, ToggleRight, ToggleLeft } from "lucide-react"

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser || storedUser.role !== "admin") {
      router.push("/admin/login")
      return
    }
    setUser(storedUser)
  }, [router])

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u)))
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const blockedUsers = users.filter((u) => u.status === "blocked").length

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">{users.length} utilisateurs au total</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{users.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actifs</CardTitle>
                <ToggleRight className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{activeUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bloqués</CardTitle>
                <ToggleLeft className="w-4 h-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{blockedUsers}</div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Tous les utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Aucun utilisateur</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Rejoints</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Commandes</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="py-3 px-4 text-foreground font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {new Date(user.joinedDate).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-3 px-4 text-foreground font-medium">{user.orders}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                              }`}
                            >
                              {user.status === "active" ? "Actif" : "Bloqué"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              size="sm"
                              variant={user.status === "active" ? "destructive" : "default"}
                              onClick={() => handleToggleStatus(user.id)}
                              className="gap-1"
                            >
                              {user.status === "active" ? (
                                <>
                                  <ToggleLeft className="w-4 h-4" />
                                  Bloquer
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="w-4 h-4" />
                                  Débloquer
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
