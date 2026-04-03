// api/items.js
export default async function handler(req, res) {
  // Recebe os parâmetros de paginação e busca do seu Front-End
  const { limit = 12, offset = 0, q = '' } = req.query;

  try {
    let mlUrl = '';

    if (q) {
      // Se o usuário digitou algo na busca (Ex: "iPhone")
      mlUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`;
    } else {
      // Padrão da Home: Os mais vendidos da categoria Tecnologia/Eletrônicos (MLB1648)
      mlUrl = `https://api.mercadolibre.com/sites/MLB/search?category=MLB1648&sort=sold_quantity&limit=${limit}&offset=${offset}`;
    }

    // Chamada 100% PÚBLICA, sem frescura de tokens ou chaves secretas
    const mlResponse = await fetch(mlUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Mantemos apenas um User-Agent para a Vercel não ser vista como um robô suspeito
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = await mlResponse.json();

    // Se o Mercado Livre chiar, a Vercel repassa o erro para nós
    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json(data);
    }

    // Sucesso absoluto! Retorna os dados para o seu site
    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    return res.status(500).json({ error: "Falha na comunicação com a API do ML" });
  }
}