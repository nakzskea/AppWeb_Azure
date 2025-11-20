// --- FICHIER: app/api/admin/products/route.ts ---
// Renvoie la liste de TOUS les produits pour l'interface d'administration.

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configuration BDD (lue depuis .env.local)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: true }
};

// Fonction GET pour récupérer tous les produits
export async function GET(req: Request) {
  let db;
  try {
    db = await mysql.createConnection(dbConfig);
    
    // Note : Pour l'admin, on récupère TOUT, même si le stock est à 0.
    const sql = "SELECT * FROM Produits ORDER BY id_produits DESC";
    const [rows] = await db.execute(sql);

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Erreur API Get Admin Produits:", error);
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