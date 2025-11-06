// --- FICHIER: app/admin/products/page.tsx ---
"use client"

// MODIFICATION: Import de useEffect
import { useEffect, useState } from "react" 
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminProductModal } from "@/components/admin-product-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser, isAdminUser } from "@/lib/auth" 
import type { Produit } from "@/lib/mock-data" 
import { Plus, Edit2, Trash2, Package } from "lucide-react"

export default function AdminProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null) 
  const [products, setProducts] = useState<Produit[]>([]) 
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produit | undefined>() 
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser || !isAdminUser(storedUser)) { 
      router.push("/login") // Renvoi vers le login client
      return
    }
    setUser(storedUser)

    // --- MODIFICATION: APPEL À L'API ADMIN ---
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // On appelle notre nouvelle API admin
        const response = await fetch('/api/admin/products'); 
        if (!response.ok) {
          throw new Error("Impossible de charger les produits.");
        }
        const data: Produit[] = await response.json();
        setProducts(data); // On met à jour le state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    // --- FIN MODIFICATION ---

    fetchProducts()
  }, [router]) // On garde router comme dépendance

  // ... (le reste de vos fonctions handleAddProduct, handleEditProduct, etc.)
  // ... (Ces fonctions ne marcheront pas encore, nous n'avons pas fait POST/PUT/DELETE)
  
  const handleAddProduct = () => { /* ... */ }
  const handleEditProduct = (product: Produit) => { /* ... */ }
  const handleSaveProduct = async (product: Produit) => { /* ... */ }
  const handleDeleteProduct = async (id_produits: number) => { /* ... */ }


  if (!user || loading) return null // Affiche le chargement

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* ... (Titre) ... */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestion des Produits</h1>
              <p className="text-muted-foreground mt-1">{products.length} produits en stock</p>
            </div>
            <Button onClick={handleAddProduct} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </Button>
          </div>

          <Card>
            {/* ... (CardHeader) ... */}
            <CardContent>
              {/* MODIFICATION: Gestion du loading/vide */}
              {loading ? (
                 <p className="text-center py-12 text-muted-foreground">Chargement...</p>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Aucun produit</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      {/* ... (ths) ... */}
                    </thead>
                    <tbody>
                      {/* Le .map() fonctionnera maintenant avec les données de la BDD */}
                      {products.map((product) => (
                        <tr 
                          key={product.id_produits} 
                          className="border-b border-border hover:bg-muted/50 transition"
                        >
                          <td className="py-3 px-4 text-foreground font-medium">{product.nom_produit}</td> 
                          <td className="py-3 px-4 text-muted-foreground">{product.id_categorie}</td> 
                          <td className="py-3 px-4 font-bold text-primary">${product.prix}</td> 
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                product.quantite > 0
                                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                              }`}
                            >
                              {product.quantite}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right flex gap-2 justify-end">
                            {/* ... (Boutons Edit/Delete) ... */}
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

      {/* ... (Modal) ... */}
    </div>
  )
}