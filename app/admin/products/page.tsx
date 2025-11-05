// --- FICHIER: app/admin/products/page.tsx ---
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminProductModal } from "@/components/admin-product-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// MODIFICATION: Import de isAdminUser
import { getStoredUser, isAdminUser } from "@/lib/auth" 
// MODIFICATION: Import du type Produit aligné BDD
import type { Produit } from "@/lib/mock-data" 
import { Plus, Edit2, Trash2, Package } from "lucide-react"

export default function AdminProductsPage() {
  const router = useRouter()
  // L'interface 'any' peut être remplacée par AuthUser | null si importé
  const [user, setUser] = useState<any>(null) 
  // MODIFICATION: Utilisation du type Produit[]
  const [products, setProducts] = useState<Produit[]>([]) 
  const [isModalOpen, setIsModalOpen] = useState(false)
  // MODIFICATION: Utilisation du type Produit
  const [selectedProduct, setSelectedProduct] = useState<Produit | undefined>() 
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    // MODIFICATION: Vérification d'administration en utilisant isAdminUser et le flag 'admin' (0 ou 1)
    if (!storedUser || !isAdminUser(storedUser)) { 
      router.push("/admin/login")
      return
    }
    setUser(storedUser)

    // ZONE DE LIAISON BDD: Récupérer tous les produits depuis la BDD
    // GET /api/admin/products pour charger la liste complète
    // Chaque produit doit renvoyer les champs BDD: id_produits, nom_produit, id_categorie, prix, quantite (stock)

    const fetchProducts = async () => {
      try {
        // const response = await fetch('/api/admin/products');
        // const data: Produit[] = await response.json();
        // setProducts(data);
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  const handleAddProduct = () => {
    setSelectedProduct(undefined)
    setIsModalOpen(true)
  }

  // MODIFICATION: Utilisation du type Produit
  const handleEditProduct = (product: Produit) => { 
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // MODIFICATION: Utilisation du type Produit
  const handleSaveProduct = async (product: Produit) => { 
    // ZONE DE LIAISON BDD: Sauvegarder le produit dans la BDD
    // Si modification: PUT /api/admin/products/{id_produits} avec les données de Produit
    // Si création: POST /api/admin/products avec les données de Produit
    // Mettre à jour la liste locale après succès

    if (selectedProduct) {
      // MODIFICATION: Utilisation de id_produits
      setProducts(products.map((p) => (p.id_produits === selectedProduct.id_produits ? product : p))) 
    } else {
      // MODIFICATION: Utilisation de id_produits pour l'ID fictif et les clés
      setProducts([...products, { ...product, id_produits: Math.max(...products.map((p) => p.id_produits), 0) + 1 } as Produit]) 
    }
    setSelectedProduct(undefined)
  }

  // MODIFICATION: Utilisation de id_produits
  const handleDeleteProduct = async (id_produits: number) => { 
    // ZONE DE LIAISON BDD: Supprimer le produit de la BDD
    // DELETE /api/admin/products/{id_produits}
    // Retirer le produit de la liste locale après succès

    // MODIFICATION: Utilisation de id_produits
    setProducts(products.filter((p) => p.id_produits !== id_produits)) 
  }

  if (!user || loading) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Tous les produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Aucun produit</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Catégorie ID</th> {/* Modification pour refléter l'ID BDD */}
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Prix</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Stock</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* ZONE DE LIAISON BDD: Itération sur la liste des produits */}
                      {products.map((product) => (
                        <tr 
                          // MODIFICATION: Utilisation de id_produits comme clé
                          key={product.id_produits} 
                          className="border-b border-border hover:bg-muted/50 transition"
                        >
                          {/* MODIFICATION: Utilisation de nom_produit */}
                          <td className="py-3 px-4 text-foreground font-medium">{product.nom_produit}</td> 
                          {/* MODIFICATION: Utilisation de id_categorie */}
                          <td className="py-3 px-4 text-muted-foreground">{product.id_categorie}</td> 
                          {/* MODIFICATION: Utilisation de prix */}
                          <td className="py-3 px-4 font-bold text-primary">${product.prix}</td> 
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                // MODIFICATION: Utilisation de quantite (stock)
                                product.quantite > 0
                                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                              }`}
                            >
                              {product.quantite} {/* MODIFICATION: Utilisation de quantite */}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                              className="gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              // MODIFICATION: Utilisation de id_produits
                              onClick={() => handleDeleteProduct(product.id_produits)} 
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

      {/* MODIFICATION: selectedProduct est maintenant de type Produit */}
      <AdminProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(undefined)
        }}
        onSave={handleSaveProduct}
      />
    </div>
  )
}