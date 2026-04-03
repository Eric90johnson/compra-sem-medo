// api/items.js
import { createClient } from 'redis';

export default async function handler(req, res) {
  const curatedIds = [
    'MLB3437775983', 'MLB3350711915', 'MLB3856116838', 'MLB3403323049',
    'MLB4317056020', 'MLB3462947110', 'MLB3421060935', 'MLB3446864501'
  ].join(',');

  // Configura o cliente do Redis usando a variável exata que a Vercel gerou
  // Tenta maiúscula e minúscula para garantir que vai achar a chave
  const redisUrl = process.env.KV_REDIS_URL || process.env.kv_REDIS_URL;
  const redis = createClient({ url: redisUrl });

  try {
    // 1. Conecta ao novo Banco de Dados
    await redis.connect();

    // 2. Busca o token
    let token = await redis.get('ml_access_token');

    // 3. Se não existir, renova!
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
      
      // 4. Salva os novos tokens no formato correto da biblioteca redis
      // EX = Expira em 20000 segundos (aprox 5h30)
      await redis.set('ml_access_token', token, { EX: 20000 });
      await redis.set('ml_refresh_token', refreshData.refresh_token);
      
      console.log("✅ Novos tokens salvos no Redis!");
    }

    // 5. Busca os produtos no Mercado Livre
    const mlResponse = await fetch(`https://api.mercadolibre.com/items?ids=${curatedIds}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = await mlResponse.json();

    // 6. Fecha a conexão com o banco para não sobrecarregar
    await redis.disconnect();

    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    // Tenta fechar a conexão caso tenha dado algum erro no meio do caminho
    if (redis.isOpen) await redis.disconnect();
    return res.status(500).json({ error: "Falha na comunicação com o banco de dados ou API" });
  }
}