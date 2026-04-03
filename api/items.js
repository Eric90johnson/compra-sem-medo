// api/items.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Lista VIP de produtos curados
  const curatedIds = [
    'MLB3437775983', 'MLB3350711915', 'MLB3856116838', 'MLB3403323049',
    'MLB4317056020', 'MLB3462947110', 'MLB3421060935', 'MLB3446864501'
  ].join(',');

  try {
    // 1. Tenta buscar o access_token atual no banco de dados KV
    let token = await kv.get('ml_access_token');

    // 2. Se não existir ou estiver expirado, vamos renovar!
    if (!token) {
      console.log("🔄 Token expirado. Renovando com o Refresh Token...");
      
      // Busca o último Refresh Token salvo (ou usa o inicial do Environment Variable da Vercel)
      const currentRefreshToken = await kv.get('ml_refresh_token') || process.env.ML_REFRESH_TOKEN;

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
        return res.status(401).json({ error: "Erro ao renovar token", details: refreshData });
      }

      token = refreshData.access_token;
      
      // 3. Salva os NOVOS tokens no banco para as próximas 6 horas
      // Definimos validade de 5h30 (20000 segundos) para máxima segurança
      await kv.set('ml_access_token', token, { ex: 20000 });
      await kv.set('ml_refresh_token', refreshData.refresh_token);
      
      console.log("✅ Novos tokens salvos no Vercel KV!");
    }

    // --- ALTERAÇÃO DE OURO ---
    // Fazemos a chamada com o Token garantido para a API de Itens.
    const mlResponse = await fetch(`https://api.mercadolibre.com/items?ids=${curatedIds}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = await mlResponse.json();

    // --- PROTEÇÃO ANTI FALHA SILENCIOSA ---
    // Se o ML der erro, agora a Vercel repassa o erro vermelho pro painel e pro console
    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    return res.status(500).json({ error: "Erro ao conectar com a API do ML" });
  }
} 