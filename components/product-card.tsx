"use client"

import type { Product } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative w-full h-48 bg-muted">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
        </div>
        <p className="text-2xl font-bold text-primary">${product.price}</p>
        <Button onClick={() => onAddToCart(product)} className="w-full gap-2" disabled={product.stock === 0}>
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
        </Button>
      </CardFooter>
    </Card>
  )
}
