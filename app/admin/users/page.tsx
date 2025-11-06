// --- FICHIER: app/admin/users/page.tsx ---
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser, isAdminUser } from "@/lib/auth"
import type { Utilisateur } from "@/lib/mock-data"
import { Shield, Users, Edit, Trash2 } from "lucide-react"

// --- MODIFICATION: Ajout de composants pour le Modal ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
// ---------------------------------------------------

type BasicUtilisateur = Pick<Utilisateur, "id_user" | "email" | "prenom" | "nom" | "admin">;

// --- MODIFICATION: Type pour le formulaire du Modal ---
type UserFormData = Omit<BasicUtilisateur, "id_user">;

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<BasicUtilisateur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("") // Pour afficher les erreurs API

  // --- État pour le Modal de modification ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<BasicUtilisateur | undefined>()
  const [formData, setFormData] = useState<UserFormData>({
    prenom: "",
    nom: "",
    email: "",
    admin: 0,
  })

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser || !isAdminUser(storedUser)) {
      router.push("/login")
      return
    }
    setUser(storedUser)

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error("Impossible de charger les utilisateurs.");
        }
        const data: BasicUtilisateur[] = await response.json();
        setUsers(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers()
  }, [router])

  // --- MODIFICATION: Handlers connectés à l'API ---

  const handleEditUser = (userToEdit: BasicUtilisateur) => {
    // Ouvre le modal et pré-remplit le formulaire
    setSelectedUser(userToEdit)
    setFormData({
      prenom: userToEdit.prenom,
      nom: userToEdit.nom,
      email: userToEdit.email,
      admin: userToEdit.admin,
    })
    setIsModalOpen(true)
    setError("") // Réinitialise les erreurs
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    if (!selectedUser) return;

    // ZONE DE LIAISON BDD: Appel à l'API PUT
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id_user}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Envoie les données du formulaire
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de la mise à jour");
      }

      // Met à jour l'état local
      setUsers(users.map((u) => (u.id_user === selectedUser.id_user ? data.user : u)));
      
      // Ferme le modal
      setIsModalOpen(false)
      setSelectedUser(undefined)

    } catch (err) {
      setError((err as Error).message);
      // Ne pas fermer le modal si erreur, pour que l'utilisateur puisse voir
    }
  }

  const handleDeleteUser = async (id_user: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
      return
    }

    // ZONE DE LIAISON BDD: Appel à l'API DELETE
    try {
      const response = await fetch(`/api/admin/users/${id_user}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de la suppression");
      }

      // Met à jour l'état local
      setUsers(users.filter((u) => u.id_user !== id_user))
    
    } catch (err) {
      setError((err as Error).message);
    }
  }

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

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Tous les utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <p className="text-center py-12 text-muted-foreground">Chargement...</p>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Aucun utilisateur</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      {/* ... (En-têtes de table) ... */}
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id_user} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="py-3 px-4 text-foreground font-medium">{user.prenom} {user.nom}</td>
                          <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                user.admin === 1
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {user.admin === 1 ? "Admin" : "Client"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                              className="gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id_user)}
                              className="gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
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

      {/* --- MODIFICATION: Ajout du Modal d'édition --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {/* Afficher l'erreur API dans le modal */}
          {error && (
             <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>
          )}
          <form onSubmit={handleSaveUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prenom" className="text-right">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nom" className="text-right">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="flex items-center gap-2 justify-end col-span-4">
                <Checkbox
                  id="admin"
                  checked={formData.admin === 1}
                  onCheckedChange={(checked) => setFormData({ ...formData, admin: checked ? 1 : 0 })}
                />
                <Label htmlFor="admin" className="cursor-pointer">
                  Est Administrateur
                </Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* --- FIN DU MODAL --- */}
    </div>
  )
}