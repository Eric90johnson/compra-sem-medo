// api/items.js
import { createClient } from 'redis';

export default async function handler(req, res) {
  // Extrai os parâmetros dinâmicos enviados pelo Front-End (Paginação e Busca)
  const { limit = 12, offset = 0, q = '' } = req.query;

  const redisUrl = process.env.KV_REDIS_URL || process.env.kv_REDIS_URL;
  const redis = createClient({ url: redisUrl });

  try {
    await redis.connect();
    let token = await redis.get('ml_access_token');

    // 1. Motor de Sobrevivência (Continua rodando para manter a conta segura)
    if (!token) {
      console.log("🔄 Token expirado. Renovando com o Refresh Token...");
      const currentRefreshToken = await redis.get('ml_refresh_token') || process.env.ML_REFRESH_TOKEN;

      const refreshResponse = await fetch("https://api.mercadolibre.com/oauth/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.ML_CLIENT_ID,
          client_secret: process.env.ML_CLIENT_SECRET,
          refresh_token: currentRefreshToken
        })
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        await redis.disconnect();
        return res.status(401).json({ error: "Erro ao renovar token", details: refreshData });
      }

      token = refreshData.access_token;
      await redis.set('ml_access_token', token, { EX: 20000 });
      await redis.set('ml_refresh_token', refreshData.refresh_token);
      console.log("✅ Novos tokens salvos no Redis!");
    }

    // 2. BUSCA DINÂMICA (A Mágica da Automação)
    // Se não houver pesquisa, pega os "Mais Vendidos" de uma categoria genérica (MLB1051 = Celulares).
    // O limit e o offset vêm da sua PaginationBar!
    let mlUrl = `https://api.mercadolibre.com/sites/MLB/search?category=MLB1051&limit=${limit}&offset=${offset}`;
    
    // Se o usuário digitou algo no campo de busca do seu site, altera a URL:
    if (q) {
      mlUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`;
    }

    // Fazemos a chamada PÚBLICA (SEM enviar o Header Authorization de aplicativo). Evita o Erro 403!
    const mlResponse = await fetch(mlUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = await mlResponse.json();
    await redis.disconnect();

    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    if (redis.isOpen) await redis.disconnect();
    return res.status(500).json({ error: "Falha na comunicação com o banco de dados ou API" });
  }
}