// api/items.js
export default async function handler(req, res) {
  // Lista VIP de produtos curados
  const curatedIds = [
    'MLB3437775983', 'MLB3350711915', 'MLB3856116838', 'MLB3403323049',
    'MLB4317056020', 'MLB3462947110', 'MLB3421060935', 'MLB3446864501'
  ].join(',');

  try {
    // --- ALTERAÇÃO DE OURO ---
    // Removemos o Token! Fazemos uma chamada 100% pública para a API de Itens.
    const mlResponse = await fetch(`https://api.mercadolibre.com/items?ids=${curatedIds}`, {
      method: 'GET',
      headers: {
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
    return res.status(500).json({ error: "Erro ao conectar com a API do ML" });
  }
}