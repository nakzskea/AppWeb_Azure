// --- FICHIER: app/api/auth/signup/route.ts ---

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// Lire la configuration BDD depuis .env.local
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export async function POST(req: Request) {
  let db;

  try {
    // 1. Récupérer les données du formulaire d'inscription
    const body = await req.json();
    const { email, mdp, prenom, nom } = body;

    if (!email || !mdp || !prenom || !nom) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);

    // 2. VÉRIFIER SI L'UTILISATEUR EXISTE DÉJÀ
    const [existing] = await db.execute(
      "SELECT id_user FROM Utilisateurs WHERE email = ?",
      [email]
    );
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 } // 409 = Conflit
      );
    }

    // 3. HACHER LE MOT DE PASSE (L'ÉTAPE CLÉ)
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
    const mdpHache = await bcrypt.hash(mdp, saltRounds);

    // 4. INSÉRER L'UTILISATEUR DANS LA BDD
    const sql = `
      INSERT INTO Utilisateurs (email, mdp, prenom, nom, admin) 
      VALUES (?, ?, ?, ?, 0)
    `; // Par défaut, admin = 0 (client normal)

    await db.execute(sql, [email, mdpHache, prenom, nom]);

    return NextResponse.json(
      { message: "Compte créé avec succès !" },
      { status: 201 } // 201 = Créé
    );

  } catch (error) {
    console.error("Erreur API Signup:", error);
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