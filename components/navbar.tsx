"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getStoredUser, clearUser } from "@/lib/auth"
import { useEffect, useState } from "react"

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    const updateCart = () => {
      const cart = localStorage.getItem("innovtech_cart")
      const items = cart ? JSON.parse(cart) : []
      setCartCount(items.length)
    }

    updateCart()
    window.addEventListener("storage", updateCart)
    return () => window.removeEventListener("storage", updateCart)
  }, [])

  const handleLogout = () => {
    clearUser()
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">IT</span>
          </div>
          <span className="text-xl font-bold text-primary hidden sm:inline">InnovTech</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/account">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">Connexion</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
