// --- FICHIER: app/page.tsx ---
"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
// MODIFICATION: Import du type Produit aligné BDD
import type { Produit } from "@/lib/mock-data" 
import { ArrowRight } from "lucide-react"

// ZONE DE LIAISON BDD: Récupérer la liste des produits depuis la base de données
// Utiliser une route API (ex: GET /api/produits) ou une Server Action pour charger les produits.
// const products = await fetchProduits(); 
// (Implémenter cette logique avec useEffect ou en Server Component)

export default function Home() {
  const [notification, setNotification] = useState("")
  // MODIFICATION: Utilisation du type Produit[]
  const [products, setProducts] = useState<Produit[]>([]) 
  // NOTE: Les produits doivent être chargés (via useEffect ou Server Component) pour que la liste s'affiche.

  // MODIFICATION: Utilisation du type Produit
  const handleAddToCart = (product: Produit) => { 
    const cart = localStorage.getItem("innovtech_cart")
    const items = cart ? JSON.parse(cart) : []

    // MODIFICATION: Utilisation de id_produits pour la recherche
    const existingItem = items.find((item: any) => item.id_produits === product.id_produits) 
    
    if (existingItem) {
      // MODIFICATION: Utilisation de quantite_achetee (défini dans ArticlePanier)
      existingItem.quantite_achetee += 1 
    } else {
      // MODIFICATION: Utilisation de quantite_achetee
      items.push({ ...product, quantite_achetee: 1 }) 
    }

    localStorage.setItem("innovtech_cart", JSON.stringify(items))
    // MODIFICATION: Utilisation de nom_produit
    setNotification(`${product.nom_produit} ajouté au panier`) 
    setTimeout(() => setNotification(""), 3000)

    window.dispatchEvent(new Event("storage"))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {notification && (
        <div className="fixed top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Hero Section (Aucun changement nécessaire) */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        {/* ... (Contenu inchangé) ... */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Bienvenue chez <span className="text-primary">InnovTech</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Découvrez notre sélection de produits high-tech et d'accessoires professionnels pour optimiser votre
              productivité.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link href="#products">
                Voir les produits <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Nos Produits</h2>
          {/* ZONE DE LIAISON BDD: Afficher le nombre de produits provenant de la BDD */}
          <p className="text-muted-foreground">{products.length} articles disponibles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ZONE DE LIAISON BDD: Itération sur la liste des produits depuis la BDD */}
          {products.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">En attente de chargement des produits...</p>
          ) : (
            // MODIFICATION: Utilisation de id_produits comme clé
            products.map((product) => (
              <ProductCard 
                key={product.id_produits} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))
          )}
        </div>
      </section>

      {/* Footer (Aucun changement nécessaire) */}
      <footer className="border-t border-border bg-card mt-16">
        {/* ... (Contenu inchangé) ... */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">À propos</h3>
              <p className="text-sm text-muted-foreground">
                InnovTech est votre partenaire de confiance pour les solutions high-tech.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Produits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Accessoires
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Périphériques
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Stockage
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 InnovTech. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}