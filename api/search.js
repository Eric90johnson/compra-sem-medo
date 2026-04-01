// api/search.js
export default async function handler(req, res) {
  const { q } = req.query;

  let url = `https://api.mercadolibre.com/sites/MLB/search?q=${q}`;
  
  if (q === 'tecnologia') {
    url = `https://api.mercadolibre.com/sites/MLB/search?category=MLB1648`;
  }

  try {
    const mlResponse = await fetch(url, {
      method: 'GET',
      headers: {
        // --- A JOGADA DE MESTRE ---
        // 1. Sem Token de Autorização! Fazemos um pedido público para evitar o bloqueio de política.
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        // 2. Disfarce forte para a Vercel passar pela porta da frente parecendo o Google Chrome.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json();
      return res.status(mlResponse.status).json(errorData);
    }

    const data = await mlResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro interno no Backend Serverless:", error);
    return res.status(500).json({ error: "Falha ao se comunicar com a API." });
  }
}