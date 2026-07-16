#!/usr/bin/env node
/* Reads .env and writes telegram keys into js/config.js */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const configPath = path.join(root, 'js', 'config.js');

if (!fs.existsSync(envPath)) {
  console.error('Missing .env — copy .env.example to .env and fill in your keys.');
  process.exit(1);
}

const env = {};
fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(function (line) {
  line = line.trim();
  if (!line || line.charAt(0) === '#') return;
  var i = line.indexOf('=');
  if (i === -1) return;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
});

const token = env.TELEGRAM_BOT_TOKEN || '';
const chatId = env.TELEGRAM_CHAT_ID || '';

const out = `/* Site config — generated from .env (run: node scripts/sync-config.js) */
window.BIGBRAIN_CONFIG = {
  knowledgeUrl: "data/knowledge.json",
  substackUrl: "https://xbigbrainnx.substack.com",
  buyBase: "https://selar.com/m/xbig-brainnx1",
  telegramBotToken: ${JSON.stringify(token)},
  telegramChatId: ${JSON.stringify(chatId)}
};
`;

fs.writeFileSync(configPath, out);
console.log('Updated js/config.js from .env');
