// api/notion.js
// Vercel Serverless Function — 在伺服器端呼叫 Notion，完全沒有 CORS 問題

export default async function handler(req, res) {
  // 允許來自任何來源（你自己的前端）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 瀏覽器預檢請求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 從請求中取得：目標路徑、方法、token、body
  const { path, method = 'GET', token, body } = req.body || {};

  if (!path || !token) {
    return res.status(400).json({ error: '缺少 path 或 token' });
  }

  try {
    const notionRes = await fetch('https://api.notion.com' + path, {
      method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await notionRes.json();
    return res.status(notionRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
