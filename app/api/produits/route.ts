// --- FICHIER: app/api/produits/route.ts ---
// Cette route est PUBLIQUE et permet à tout le monde de VOIR les produits.

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configuration BDD (lue depuis .env.local)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export async function GET(req: Request) {
  let db;

  try {
    db = await mysql.createConnection(dbConfig);

    // On sélectionne tous les produits. 
    // On pourrait aussi filtrer 'WHERE quantite > 0'
    const sql = "SELECT * FROM Produits";
    const [rows] = await db.execute(sql);

    // Renvoyer les produits au format JSON
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Erreur API Get Produits:", error);
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