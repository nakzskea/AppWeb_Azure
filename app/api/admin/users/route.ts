// --- FICHIER: app/api/admin/users/route.ts ---
// Renvoie la liste de TOUS les utilisateurs pour l'interface d'administration.

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configuration BDD
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Fonction GET pour récupérer tous les utilisateurs
export async function GET(req: Request) {
  let db;
  try {
    db = await mysql.createConnection(dbConfig);

    // !! SÉCURITÉ !!
    // On sélectionne tous les champs SAUF le mot de passe (mdp)
    const sql = "SELECT id_user, email, prenom, nom, admin FROM Utilisateurs";
    const [rows] = await db.execute(sql);

    // ICI: Votre BDD n'a pas 'status', 'joinedDate', 'orders'.
    // L'API renvoie ce qu'elle a. Le frontend devra s'adapter
    // ou vous devrez ajouter ces champs à votre BDD.
    // Pour l'instant, on renvoie les données brutes.
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Erreur API Get Admin Users:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.end();
    }
  }
}