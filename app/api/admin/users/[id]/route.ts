// --- FICHIER: app/api/admin/users/[id]/route.ts ---
// Gère la MODIFICATION (PUT) et la SUPPRESSION (DELETE) d'un utilisateur spécifique.

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configuration BDD (lue depuis .env.local)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// --- FONCTION DELETE ---
// Gère la suppression d'un utilisateur
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } // Récupère l'ID de l'URL
) {
  let db;
  const id_user = params.id; // L'ID de l'utilisateur à supprimer

  try {
    db = await mysql.createConnection(dbConfig);

    // !! SÉCURITÉ (À IMPLÉMENTER) !!
    // Vous devriez vérifier que l'admin ne se supprime pas lui-même.
    // const adminActuel = //... (à récupérer du token JWT)
    // if (adminActuel.id_user === parseInt(id_user)) {
    //   return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 403 });
    // }

    // Exécuter la suppression
    const sql = "DELETE FROM Utilisateurs WHERE id_user = ?";
    const [result] = await db.execute(sql, [id_user]);
    
    // Vérifier si la suppression a fonctionné
    if ((result as any).affectedRows === 0) {
        return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }

    return NextResponse.json({ message: "Utilisateur supprimé avec succès." });

  } catch (error) {
    console.error("Erreur API Delete User:", error);
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

// --- FONCTION PUT ---
// Gère la modification d'un utilisateur
export async function PUT(
  req: Request,
  { params }: { params: { id: string } } // Récupère l'ID de l'URL
) {
  let db;
  const id_user = params.id; // L'ID de l'utilisateur à modifier

  try {
    const body = await req.json();
    // On ne récupère QUE les champs modifiables
    const { prenom, nom, email, admin } = body; 

    if (!prenom || !nom || !email || admin === undefined) {
      return NextResponse.json(
        { error: "Tous les champs (prenom, nom, email, admin) sont requis." },
        { status: 400 }
      );
    }
    
    db = await mysql.createConnection(dbConfig);

    // Exécuter la mise à jour
    // NE PAS inclure le champ 'mdp' ici !
    const sql = `
      UPDATE Utilisateurs 
      SET prenom = ?, nom = ?, email = ?, admin = ?
      WHERE id_user = ?
    `;
    const [result] = await db.execute(sql, [prenom, nom, email, admin, id_user]);

    if ((result as any).affectedRows === 0) {
        return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }

    // Renvoyer l'utilisateur mis à jour (sans le mdp)
    const updatedUser = { id_user: parseInt(id_user), prenom, nom, email, admin };
    return NextResponse.json({ message: "Utilisateur mis à jour.", user: updatedUser });

  } catch (error) {
    // Gérer les erreurs de duplicata d'email
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }
    
    console.error("Erreur API Put User:", error);
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