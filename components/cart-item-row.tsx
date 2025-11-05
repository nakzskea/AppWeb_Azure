// --- FICHIER: cart-item-row.tsx ---
"use client"

// Mise à jour de l'importation de type pour utiliser notre nouveau type ArticlePanier
import type { ArticlePanier } from "@/lib/mock-data" 
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItemRowProps {
  // item utilise le type ArticlePanier
  item: ArticlePanier 
  // Les fonctions utilisent l'ID du produit de la BDD: id_produits
  onQuantityChange: (id_produits: number, quantite_achetee: number) => void 
  onRemove: (id_produits: number) => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
        {/* Remplacement de item.image par item.image_url */}
        <Image src={item.image_url || "/placeholder.svg"} alt={item.nom_produit} fill className="object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Remplacement de item.name par item.nom_produit */}
          <h3 className="font-semibold text-foreground">{item.nom_produit}</h3>
          {/* Afficher l'ID de catégorie ou un nom de catégorie récupéré via jointure si possible */}
          <p className="text-sm text-muted-foreground">Catégorie ID: {item.id_categorie}</p>
        </div>
        {/* item.price correspond à item.prix */}
        <p className="text-lg font-bold text-primary">${item.prix}</p> 
      </div>

      <div className="flex flex-col items-end justify-between">
        {/* ZONE DE LIAISON BDD: Les changements de quantité pourraient déclencher des mises à jour de stock en temps réel */}
        <div className="flex items-center gap-2 bg-secondary rounded-lg">
          {/* Les fonctions utilisent id_produits et quantite_achetee */}
          <Button variant="ghost" size="sm" onClick={() => onQuantityChange(item.id_produits, item.quantite_achetee - 1)}>
            <Minus className="w-4 h-4" />
          </Button>
          {/* Remplacement de item.quantity par item.quantite_achetee */}
          <span className="w-8 text-center font-semibold">{item.quantite_achetee}</span>
          <Button variant="ghost" size="sm" onClick={() => onQuantityChange(item.id_produits, item.quantite_achetee + 1)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-2">Sous-total</p>
          {/* Calcul du sous-total avec item.prix et item.quantite_achetee */}
          <p className="font-bold text-foreground">${(item.prix * item.quantite_achetee).toFixed(2)}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id_produits)} // Utilise id_produits
            className="text-destructive hover:text-destructive mt-2 gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  )
}