const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load API key from .env
const envPath = path.join(__dirname, '.env');
let OPENAI_API_KEY = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('OPENAI_API_KEY=')) {
            OPENAI_API_KEY = line.replace('OPENAI_API_KEY=', '').trim();
            break;
        }
    }
    if (OPENAI_API_KEY) {
        console.log('[OK] API Key loaded from .env');
    } else {
        console.log('[ERROR] OPENAI_API_KEY not found in .env');
        process.exit(1);
    }
} catch (err) {
    console.log('[ERROR] Cannot read .env file:', err.message);
    process.exit(1);
}

const PORT = 3000;

// MIME types for static files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

// Call OpenAI API
function callOpenAI(prompt) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50,
            temperature: 0.2
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) {
                        reject(new Error(json.error.message));
                    } else if (json.choices && json.choices[0]) {
                        resolve(json.choices[0].message.content);
                    } else {
                        reject(new Error('Invalid response from OpenAI'));
                    }
                } catch (e) {
                    reject(new Error('Failed to parse OpenAI response'));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const { method, url } = req;
    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${url}`);

    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API endpoint
    if (method === 'POST' && url === '/api/explain') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { question, selectedOption, correctAnswer, options } = JSON.parse(body);

                const prompt = `Questao ENARE: "${question}"
Resposta correta: ${correctAnswer}

Em 1 frase MUITO curta, explique por que ${correctAnswer} e a correta. Portugues.`;

                console.log('[API] Calling OpenAI...');
                const explanation = await callOpenAI(prompt);
                console.log('[API] Response received');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ explanation }));

            } catch (error) {
                console.log('[API] Error:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // Serve static files
    let filePath = url === '/' ? '/index.html' : url;

    // Remove query strings
    filePath = filePath.split('?')[0];

    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(fullPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log('');
    console.log('================================');
    console.log('  ENARE 2023 - Estudo Focado');
    console.log('================================');
    console.log(`  Server: http://localhost:${PORT}`);
    console.log('================================');
    console.log('');
});
