// --- FICHIER: mock-data.ts ---
// ATTENTION: TOUTES LES DONNÉES FICTIVES ORIGINALES ONT ÉTÉ SUPPRIMÉES.

// --- ZONES DE LIAISON BDD: Interfaces alignées avec le schéma de base de données ---

// Interface pour la table Produits
export interface Produit {
  id_produits: number
  id_categorie: number // Clé étrangère vers Catégorie
  nom_produit: string
  prix: number // FLOAT
  quantite: number // Stock actuel (quantite dans la BDD)
  description: string // LONGTEXT
  image_url: string // image_url dans la BDD
}

// Interface pour la table Utilisateurs
export interface Utilisateur {
  id_user: number
  admin: 0 | 1 // TINYINT (0 pour client, 1 pour admin)
  email: string
  mdp: string // Le mot de passe HASHÉ ne doit jamais être exposé au frontend
  prenom: string
  nom: string
}

// Interface pour la table Vente (un enregistrement de ligne de vente)
export interface Vente {
  id_vente: number
  id_produit: number
  id_user: number
  date_vente: string // DATETIME
  quantite: number // Quantité vendue de ce produit dans cette transaction
}

// Interface pour un article dans le panier (utilise les champs de Produit pour les informations et ajoute la quantité achetée)
export interface ArticlePanier extends Produit {
  quantite_achetee: number // Quantité que le client veut acheter
}

// ZONE DE LIAISON BDD: Créer des fonctions utilitaires pour récupérer les données du backend.
// REMPLACER ces exemples par l'implémentation d'appels à votre API pour les opérations CRUD (Create, Read, Update, Delete).

// Exemples de fonctions à implémenter:
// - async function fetchProduits(): Promise<Produit[]>
// - async function fetchProduit(id: number): Promise<Produit>
// - async function fetchUtilisateurs(): Promise<Utilisateur[]>
// - async function fetchVentes(): Promise<Vente[]>
// - etc.