"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminProductModal } from "@/components/admin-product-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser } from "@/lib/auth"
import { mockProducts, type Product } from "@/lib/mock-data"
import { Plus, Edit2, Trash2, Package } from "lucide-react"

export default function AdminProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser || storedUser.role !== "admin") {
      router.push("/admin/login")
      return
    }
    setUser(storedUser)
  }, [router])

  const handleAddProduct = () => {
    setSelectedProduct(undefined)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (product: Product) => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === selectedProduct.id ? product : p)))
    } else {
      setProducts([...products, { ...product, id: Math.max(...products.map((p) => p.id), 0) + 1 }])
    }
    setSelectedProduct(undefined)
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  if (!user) return null

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
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Catégorie</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Prix</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Stock</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="py-3 px-4 text-foreground font-medium">{product.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                          <td className="py-3 px-4 font-bold text-primary">${product.price}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                product.stock > 0
                                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                              }`}
                            >
                              {product.stock}
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
                              onClick={() => handleDeleteProduct(product.id)}
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
