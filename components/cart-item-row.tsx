"use client"

import type { CartItem } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.category}</p>
        </div>
        <p className="text-lg font-bold text-primary">${item.price}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2 bg-secondary rounded-lg">
          <Button variant="ghost" size="sm" onClick={() => onQuantityChange(item.id, item.quantity - 1)}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <Button variant="ghost" size="sm" onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-2">Subtotal</p>
          <p className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
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
