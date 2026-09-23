/* Vercel serverless relay: keeps the Telegram bot token on the server.
   Front-end POSTs { text } here; we forward to Telegram and return the real result. */
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, reason: 'method' }));
  }
  var token = process.env.TELEGRAM_BOT_TOKEN;
  var chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ ok: false, reason: 'missing' }));
  }
  var body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  var text = body && typeof body.text === 'string' ? body.text.trim() : '';
  if (!text || text.length > 4000) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ ok: false, reason: 'bad-request' }));
  }
  try {
    var r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text })
    });
    var data = await r.json().catch(function () { return {}; });
    res.statusCode = r.ok && data.ok ? 200 : 502;
    return res.end(JSON.stringify({ ok: !!(r.ok && data.ok), reason: r.ok && data.ok ? undefined : 'telegram' }));
  } catch (e) {
    res.statusCode = 502;
    return res.end(JSON.stringify({ ok: false, reason: 'network' }));
  }
};
