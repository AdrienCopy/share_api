module.exports = async (req, res) => {
    // Gestion des requêtes POST
    if (req.method === 'POST') {
        // Exemples de gestion CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const { accessToken } = req.body;

        try {
            // Requête vers l'API LinkedIn pour obtenir l'ID de l'utilisateur
            const response = await fetch('https://api.linkedin.com/v2/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            // Renvoyer l'ID de l'utilisateur
            res.status(200).json({ personId: data.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        // Méthode non autorisée si autre que POST
        res.status(405).json({ error: 'Méthode non autorisée' });
    }
};
