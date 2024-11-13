module.exports = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { accessToken } = req.body;

        try {
            // Requête vers l'API LinkedIn pour obtenir l'ID de l'utilisateur
            const response = await fetch('https://api.linkedin.com/v2/userinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.error) {
                throw new Error(data.message);
            }
            res.status(200).json({ personId: data.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Méthode non autorisée' });
    }
};
