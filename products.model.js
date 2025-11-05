// products.model.js (ou dans db.js si c'est un petit projet)
const db = require('./db'); // Importation du module de connexion

/**
 * Récupère tous les produits avec le nom de leur catégorie
 */
async function getAllProducts() {
    const query = `
        SELECT 
            p.id_produits, 
            p.nom_produit, 
            p.prix, 
            p.quantite, 
            p.description, 
            p.image_url,
            c.nom_categorie 
        FROM Produits p
        LEFT JOIN Categorie c ON p.id_categorie = c.id_categorie;
    `;
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        throw error;
    }
}

module.exports = {
    getAllProducts,
    // Ajoutez d'autres fonctions (getUsers, getSales, etc.) ici
};