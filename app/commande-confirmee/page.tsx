"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-3 text-center">Votre commande est confirmée !</h1>
            <p className="text-lg text-muted-foreground mb-8 text-center">✅ Merci pour votre achat chez InnovTech.</p>

            <div className="bg-card border border-border rounded-lg p-6 w-full mb-8">
              <p className="text-sm text-muted-foreground mb-2">Numéro de commande</p>
              <p className="text-xl font-bold text-foreground">#ORD-{Math.floor(Math.random() * 100000)}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full mb-8">
              <p className="text-sm text-blue-900">
                Vous recevrez un email de confirmation dans les prochaines minutes avec les détails de votre commande.
              </p>
            </div>

            <Button asChild className="w-full">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Retourner à l'accueil
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
