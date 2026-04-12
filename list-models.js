const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/GOOGLE_API_KEY\s*=\s*"?([^"\r\n]+)/);
const key = match ? match[1].trim() : null;

if (!key) {
  console.log('No API key found in .env');
  process.exit(1);
}

const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + key;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        json.models
          .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
          .forEach(m => console.log(m.name));
      } else {
        console.log('Response:', data);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});
