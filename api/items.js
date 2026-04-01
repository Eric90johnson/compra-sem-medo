// api/items.js
export default async function handler(req, res) {
  // Sua lista de IDs VIP que escolhemos
  const curatedIds = [
    'MLB3437775983', 'MLB3350711915', 'MLB3856116838', 'MLB3403323049',
    'MLB4317056020', 'MLB3462947110', 'MLB3421060935', 'MLB3446864501'
  ].join(',');

  // Puxamos o Token que você já cadastrou na Vercel (VITE_ML_ACCESS_TOKEN)
  const token = process.env.VITE_ML_ACCESS_TOKEN;

  try {
    const mlResponse = await fetch(`https://api.mercadolibre.com/items?ids=${curatedIds}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Identificação obrigatória
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = await mlResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Erro ao conectar com ML" });
  }
}