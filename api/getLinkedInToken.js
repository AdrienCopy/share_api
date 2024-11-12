module.exports = async (req, res) => {
    // Gérer les requêtes POST
    if (req.method === 'POST') {
        // Exemples de gestion CORS
        res.setHeader('Access-Control-Allow-Origin', '*'); // Permet les requêtes de n'importe quelle origine
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Spécifie les méthodes autorisées
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Autorise l'en-tête Content-Type

        const { code } = req.body;

        const clientId = '781r6zese4aq4i';
        const clientSecret = 'WPL_AP1.j06rT3lNZKNF2tDB.xlKHlA==';
        const redirectUri = 'https://adriencopy.github.io/share/linkedin.html';

        const url = 'https://www.linkedin.com/oauth/v2/accessToken';
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        // Répondre à une méthode non autorisée si la méthode n'est pas POST
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
};