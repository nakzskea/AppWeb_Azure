// --- FICHIER: app/page.tsx (Mis à jour avec API) ---
"use client"

// MODIFICATION: Import de useEffect
import { useState, useEffect } from "react" 
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import type { Produit } from "@/lib/mock-data" 
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [notification, setNotification] = useState("")
  const [products, setProducts] = useState<Produit[]>([]) 
  // MODIFICATION: Ajout d'un état de chargement
  const [loading, setLoading] = useState(true); 

  // --- MODIFICATION: APPEL À L'API AU CHARGEMENT ---
  useEffect(() => {
    // Fonction pour récupérer les produits depuis notre API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // On appelle l'API que nous avons créée
        const response = await fetch('/api/produits'); 
        if (!response.ok) {
          throw new Error("Impossible de charger les produits.");
        }
        const data: Produit[] = await response.json();
        setProducts(data); // On met à jour le state avec les produits de la BDD
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Arrêter le chargement dans tous les cas
      }
    };

    fetchProducts(); // Exécuter la fonction
  }, []); // Le tableau vide [] signifie "n'exécuter qu'une fois au chargement"
  // --- FIN DE LA MODIFICATION ---

  const handleAddToCart = (product: Produit) => { 
    const cart = localStorage.getItem("innovtech_cart")
    const items = cart ? JSON.parse(cart) : []
    const existingItem = items.find((item: any) => item.id_produits === product.id_produits) 
    
    if (existingItem) {
      existingItem.quantite_achetee += 1 
    } else {
      items.push({ ...product, quantite_achetee: 1 }) 
    }

    localStorage.setItem("innovtech_cart", JSON.stringify(items))
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

      {/* Hero Section (Inchangé) */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        {/* ... */}
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
          <p className="text-muted-foreground">{products.length} articles disponibles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ZONE DE LIAISON BDD: Itération sur les produits de la BDD */}
          
          {/* MODIFICATION: Gestion de l'état de chargement */}
          {loading ? (
            <p className="col-span-full text-center text-muted-foreground">Chargement des produits...</p>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">Aucun produit trouvé.</p>
          ) : (
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

      {/* Footer (Inchangé) */}
      <footer className="border-t border-border bg-card mt-16">
        {/* ... */}
      </footer>
    </div>
  )
}