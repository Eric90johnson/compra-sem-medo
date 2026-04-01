// api/search.js
export default async function handler(req, res) {
  const { q } = req.query;

  let url = `https://api.mercadolibre.com/sites/MLB/search?q=${q}`;
  
  if (q === 'tecnologia') {
    url = `https://api.mercadolibre.com/sites/MLB/search?category=MLB1648`;
  }

  try {
    // --- ALTERAÇÃO MESTRA: Removemos o cabeçalho 'Authorization' com o Token ---
    // Agora a Vercel faz um pedido 100% público e anônimo, evitando o bloqueio de App Não Certificado.
    const mlResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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