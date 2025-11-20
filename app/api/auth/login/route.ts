// --- FICHIER: app/api/auth/login/route.ts ---

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// --- VOS IDENTIFIANTS DE CONNEXION BDD (depuis .env.local) ---
// process.env lit les variables de votre fichier .env.local
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: true }
};
// ------------------------------------------

export async function POST(req: Request) {
  let db; 

  try {
    const body = await req.json();
    const { email, mdp } = body;

    if (!email || !mdp) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);

    const sql = "SELECT * FROM Utilisateurs WHERE email = ?";
    const [rows] = await db.execute(sql, [email]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const user = rows[0] as any; 
    
    // Vérification du mot de passe (si haché)
    const isMatch = await bcrypt.compare(mdp, user.mdp);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }
    
    delete user.mdp; // Ne jamais renvoyer le mot de passe

    return NextResponse.json({
      message: "Connexion réussie !",
      user: user,
    });

  } catch (error) {
    console.error("Erreur API Login:", error);
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