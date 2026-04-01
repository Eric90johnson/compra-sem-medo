// api/search.js
export default async function handler(req, res) {
  // Pegamos o termo de busca que o seu Front-End enviou (ex: ?q=tecnologia)
  const { q } = req.query;
  
  // Puxamos a chave do cofre seguro do servidor (ela nunca vai para o navegador)
  const token = process.env.VITE_ML_ACCESS_TOKEN;

  // Montamos a URL do Mercado Livre
  let url = `https://api.mercadolibre.com/sites/MLB/search?q=${q}`;
  
  // Mantemos a estratégia de categoria para evitar bloqueios iniciais
  if (q === 'tecnologia') {
    url = `https://api.mercadolibre.com/sites/MLB/search?category=MLB1648`;
  }

  try {
    const mlResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Se o Mercado Livre bloquear, repassamos o erro limpo para o Front-End
    if (!mlResponse.ok) {
      const errorData = await mlResponse.json();
      return res.status(mlResponse.status).json(errorData);
    }

    // Se der sucesso, pegamos os produtos e enviamos para o seu site
    const data = await mlResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro interno no Backend Serverless:", error);
    return res.status(500).json({ error: "Falha ao se comunicar com a API." });
  }
}