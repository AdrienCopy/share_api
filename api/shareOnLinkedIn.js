module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).end(); // Répond avec le statut 204 No Content
    }

    if (req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const { accessToken, fullText, shareUrl, personId, imageAsset } = req.body;

        try {
            const shareBody = {
                author: `urn:li:person:${personId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: { text: fullText },
                        shareMediaCategory: imageAsset ? 'IMAGE' : 'ARTICLE', // Choisissez la catégorie selon l'image
                        media: imageAsset
                            ? [{ status: 'READY', media: `urn:li:digitalmediaAsset:${imageAsset}` }]
                            : [{ status: 'READY', originalUrl: shareUrl, title: { text: 'Title of the article' } }]
                    }
                },
                visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
            };
            const shareResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                },
                body: JSON.stringify(shareBody)
            });

            const shareData = await shareResponse.json();
            console.log('?', shareData);
            if (shareData.error) throw new Error(shareData.message);

            res.status(200).json({ message: 'Partage réussi sur LinkedIn !' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Méthode non autorisée' });
    }
};
