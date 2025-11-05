// --- FICHIER: app/admin/users/page.tsx ---
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// MODIFICATION: Import de isAdminUser et du type de base Utilisateur
import { getStoredUser, isAdminUser } from "@/lib/auth" 
import type { Utilisateur } from "@/lib/mock-data" 
import { Shield, Users, ToggleRight, ToggleLeft } from "lucide-react"

// MODIFICATION: Interface étendue pour les champs requis par l'UI
// NOTE: Votre BDD (table Utilisateurs) ne contient PAS 'joinedDate', 'orders', ou 'status'.
// L'API backend (GET /api/admin/users) DOIT calculer ces champs (par jointure/comptage)
// ou vous devez ajouter ces colonnes à votre table 'Utilisateurs'.
interface ExtendedUtilisateur extends Utilisateur {
  joinedDate: string; // Doit être fourni par le backend (ou ajouté à la BDD)
  orders: number; // Doit être calculé par le backend (COUNT des Ventes)
  status: "active" | "blocked"; // Doit être fourni par le backend (ex: un champ BDD 'is_blocked')
}

export default function AdminUsersPage() {
  const router = useRouter()
  // L'interface 'any' peut être remplacée par AuthUser | null si importé
  const [user, setUser] = useState<any>(null) 
  // MODIFICATION: Utilisation du type étendu
  const [users, setUsers] = useState<ExtendedUtilisateur[]>([]) 
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    // MODIFICATION: Vérification d'administration en utilisant isAdminUser
    if (!storedUser || !isAdminUser(storedUser)) { 
      router.push("/admin/login")
      return
    }
    setUser(storedUser)

    // ZONE DE LIAISON BDD: Récupérer la liste des utilisateurs depuis la BDD
    // GET /api/admin/users
    // Doit renvoyer les champs ExtendedUtilisateur (incluant les champs dérivés)
    const fetchUsers = async () => {
      try {
        // const response = await fetch('/api/admin/users');
        // const data: ExtendedUtilisateur[] = await response.json();
        // setUsers(data);
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  // MODIFICATION: Utilisation de id_user
  const handleToggleStatus = async (id_user: number) => { 
    // ZONE DE LIAISON BDD: Mettre à jour le statut de l'utilisateur
    // PATCH /api/admin/users/{id_user}/status
    // (Nécessite un champ 'status' ou 'is_blocked' dans la BDD)

    setUsers(users.map((u) => (u.id_user === id_user ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u)))
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const blockedUsers = users.filter((u) => u.status === "blocked").length

  if (!user || loading) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">{users.length} utilisateurs au total</p>
          </div>

          {/* Stats (Aucun changement nécessaire) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* ... (Contenu inchangé) ... */}
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
                        {/* MODIFICATION: Utilisation de "Prénom / Nom" */}
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Prénom / Nom</th> 
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Rejoints</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Commandes</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* ZONE DE LIAISON BDD: Itération sur la liste des utilisateurs */}
                      {users.map((user) => (
                        // MODIFICATION: Utilisation de id_user
                        <tr key={user.id_user} className="border-b border-border hover:bg-muted/50 transition"> 
                          {/* MODIFICATION: Utilisation de prenom et nom */}
                          <td className="py-3 px-4 text-foreground font-medium">{user.prenom} {user.nom}</td> 
                          <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {/* Utilisation du champ 'joinedDate' étendu */}
                            {new Date(user.joinedDate).toLocaleDateString("fr-FR")} 
                          </td>
                          {/* Utilisation du champ 'orders' étendu */}
                          <td className="py-3 px-4 text-foreground font-medium">{user.orders}</td> 
                          <td className="py-3 px-4">
                            {/* Utilisation du champ 'status' étendu */}
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
                              // MODIFICATION: Utilisation de id_user
                              onClick={() => handleToggleStatus(user.id_user)} 
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