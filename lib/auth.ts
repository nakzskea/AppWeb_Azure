// --- FICHIER: auth.ts ---

// Interface alignée avec la table Utilisateurs
export interface AuthUser {
  id_user: number // Correspond à id_user dans la BDD
  email: string
  prenom: string // Nouveau champ pour le prénom
  nom: string // Nouveau champ pour le nom
  admin: 0 | 1 // Correspond à admin TINYINT (0=client, 1=admin)
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

// La vérification utilise le flag numérique 'admin' (1 pour vrai)
export function isAdminUser(user: AuthUser | null): boolean {
  return user?.admin === 1
}

// ZONE DE LIAISON BDD: Remplacer les fonctions de stockage localStorage par des appels API
// Ces fonctions doivent interagir avec votre backend pour l'authentification:
//
// - async function validateUser(email: string, mdp: string): Promise<AuthUser | null>
//   POST /api/auth/login (doit vérifier l'email et le mot de passe HASHÉ (mdp) dans la BDD)
//
// - async function registerUser(email: string, mdp: string, prenom: string, nom: string): Promise<AuthUser | null>
//   POST /api/auth/signup (doit créer un nouvel Utilisateur en BDD)
//
// - async function getCurrentUser(): Promise<AuthUser | null>
//   GET /api/auth/me (pour récupérer l'utilisateur actuel via JWT ou session)
//
// - async function logoutUser(): Promise<void>
//   POST /api/auth/logout (pour invalider la session/token)