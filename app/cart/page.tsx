// --- FICHIER: app/cart/page.tsx ---
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { CartItemRow } from "@/components/cart-item-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Importation du type aligné sur la BDD : ArticlePanier
import type { ArticlePanier } from "@/lib/mock-data" 
import { ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  // Utilisation du type ArticlePanier
  const [cartItems, setCartItems] = useState<ArticlePanier[]>([]) 
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("innovtech_cart")
    // Note : L'initialisation du localStorage suppose que les données stockées
    // respectent déjà la structure ArticlePanier (id_produits, prix, quantite_achetee, etc.).
    setCartItems(cart ? JSON.parse(cart) : [])
  }, [])

  // Adaptation à id_produits et quantite_achetee
  const handleQuantityChange = (id_produits: number, newQuantity: number) => { 
    if (newQuantity <= 0) {
      handleRemoveItem(id_produits)
      return
    }

    const updated = cartItems.map((item) => 
      // Remplacement de item.id par item.id_produits et item.quantity par item.quantite_achetee
      (item.id_produits === id_produits ? { ...item, quantite_achetee: newQuantity } : item)
    )
    setCartItems(updated)
    localStorage.setItem("innovtech_cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("storage"))
  }

  // Adaptation à id_produits
  const handleRemoveItem = (id_produits: number) => { 
    const updated = cartItems.filter((item) => item.id_produits !== id_produits)
    setCartItems(updated)
    localStorage.setItem("innovtech_cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("storage"))
  }

  const handlePlaceOrder = async () => {
    // Il faudrait d'abord vérifier que l'utilisateur est connecté (non implémenté ici)
    setIsProcessing(true)
    try {
      
      // ZONE CRUCIALE DE LIAISON BDD: Appeler l'API pour créer la commande (table Vente)
      // La fonction processOrder dans order-actions.ts devrait être appelée ici.
      
      const orderData = cartItems.map(item => ({
          id_produits: item.id_produits,
          quantite: item.quantite_achetee, // Utiliser la quantité achetée
          prix: item.prix // Envoyer le prix unitaire pour référence/vérification backend
      }));

      /*
      // DÉCOMMENTER ET IMPLÉMENTER LORSQUE LE BACKEND/API SERA PRÊT
      const response = await fetch('/api/ventes', { // Utiliser un nom de route BDD (ventes)
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // L'objet envoyé doit contenir les infos nécessaires pour créer les lignes de Vente
        body: JSON.stringify({ items: orderData, total_a_verifier: total }) 
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        localStorage.removeItem("innovtech_cart");
        window.dispatchEvent(new Event("storage"));
        router.push("/commande-confirmee");
      } else {
         throw new Error(result.error || "Échec de la commande");
      }
      */
      
      // Simulation temporaire du succès (à supprimer après l'intégration BDD)
      localStorage.removeItem("innovtech_cart")
      window.dispatchEvent(new Event("storage"))
      router.push("/commande-confirmee")
      // Fin de la simulation

    } catch (error) {
      console.error("Error placing order:", error)
      // Afficher un message d'erreur à l'utilisateur si nécessaire
    } finally {
      setIsProcessing(false)
    }
  }

  // Utilisation des champs prix et quantite_achetee pour le calcul
  const subtotal = cartItems.reduce((sum, item) => sum + item.prix * item.quantite_achetee, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Continuer vos achats
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Votre Panier</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Panier vide</h2>
              <p className="text-muted-foreground mb-6">Vous n'avez pas encore ajouté de produits à votre panier.</p>
              <Button asChild>
                <Link href="/">Retourner aux produits</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-0 divide-y divide-border">
                    {cartItems.map((item) => (
                      <CartItemRow
                        // Utilise l'id_produits comme clé unique
                        key={item.id_produits} 
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4 bg-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Résumé de la commande</h3>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes (10%)</span>
                      <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="font-medium text-accent">Gratuite</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full mb-2">
                    {isProcessing ? "Traitement..." : "Commander"}
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/">Continuer vos achats</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}