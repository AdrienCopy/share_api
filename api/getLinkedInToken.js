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

        const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
        });

        try {
            // 1. Récupérer l'access token de LinkedIn
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });

            const data = await response.json();

            // Vérifiez si un token d'accès a été obtenu
            if (data.error) {
                throw new Error(data.error_description);
            }

            const accessToken = data.access_token;

            // 2. Récupérer les informations de l'utilisateur LinkedIn
            const userInfoUrl = 'https://api.linkedin.com/v2/me';
            const userInfoResponse = await fetch(userInfoUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            const userInfo = await userInfoResponse.json();

            // Vérifiez si l'utilisateur a été récupéré avec succès
            if (userInfo.error) {
                throw new Error(userInfo.error.message);
            }

            // Renvoyer l'ID de la personne (ou d'autres données de l'utilisateur)
            const personId = userInfo.id;
            res.status(200).json({ personId });

        } catch (error) {
            // En cas d'erreur, renvoyer l'erreur au client
            res.status(500).json({ error: error.message });
        }
    } else {
        // Répondre à une méthode non autorisée si la méthode n'est pas POST
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
};