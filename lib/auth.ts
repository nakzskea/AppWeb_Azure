export interface AuthUser {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

const STORAGE_KEY = "innovtech_user"

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function storeUser(user: AuthUser): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function isAdminUser(user: AuthUser | null): boolean {
  return user?.role === "admin"
}
