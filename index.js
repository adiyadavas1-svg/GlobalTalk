const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// ensure data folder exists
const DATA_DIR = path.join(__dirname, 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(FEEDBACK_FILE)) fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf8');

// visitor counter
let counter = 0;

// ROUTES
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/health', (req, res) => res.send('OK from Express!'));

app.get('/api/time', (req, res) => res.json({ time: new Date().toLocaleString() }));

app.get('/api/hello/:name', (req, res) => {
  const name = (req.params.name || 'friend').trim();
  res.json({ message: `Hello, ${name}!` });
});

const jokes = [
  'Why did the developer go broke? Because he used up all his cache.',
  'There are 10 kinds of people: those who understand binary and those who don’t.',
  'Backend bina frontend chai bina shakkar ☕🙂'
];
app.get('/api/joke', (req, res) => {
  const idx = Math.floor(Math.random() * jokes.length);
  res.json({ joke: jokes[idx] });
});

const quotes = [
  'The best way to get started is to quit talking and begin doing.',
  'Code is like humor. When you have to explain it, it’s bad.',
  'Don’t let yesterday take up too much of today.',
];
app.get('/api/quote', (req, res) => {
  const idx = Math.floor(Math.random() * quotes.length);
  res.json({ quote: quotes[idx] });
});

app.get('/api/reverse', (req, res) => {
  const text = String(req.query.text || '');
  res.json({ reversed: text.split('').reverse().join('') });
});

app.get('/api/math/sum', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: 'Provide numbers: /api/math/sum?a=10&b=5' });
  }
  res.json({ a, b, sum: a + b });
});

app.get('/api/counter', (req, res) => {
  counter += 1;
  res.json({ visits: counter });
});

app.get('/api/translate', (req, res) => {
  const text = String(req.query.text || '');
  const translated = text.toUpperCase();
  res.json({ original: text, translated });
});

// random avatar
app.get('/api/avatar', (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  const url = `https://i.pravatar.cc/150?img=${id}`;
  res.json({ avatar: url });
});

// weather (demo)
app.get('/api/weather', (req, res) => {
  const city = (req.query.city || 'Delhi').trim();
  // demo static temp
  const temp = (20 + Math.floor(Math.random() * 10)) + '°C';
  res.json({ city, temp });
});

// feedback list
app.get('/api/feedback', (req, res) => {
  try {
    const raw = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    const list = JSON.parse(raw);
    res.json({ count: list.length, items: list });
  } catch (e) {
    res.status(500).json({ error: 'Could not read feedback' });
  }
});

// feedback create
app.post('/api/feedback', (req, res) => {
  const name = String(req.body.name || '').trim() || 'Anonymous';
  const message = String(req.body.message || '').trim();
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const raw = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    const list = JSON.parse(raw);
    const item = { id: Date.now(), name, message, at: new Date().toISOString() };
    list.unshift(item);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list, null, 2), 'utf8');
    res.json({ ok: true, item });
  } catch (e) {
    res.status(500).json({ error: 'Could not save feedback' });
  }
});

app.listen(PORT, () => console.log(`Express server running at http://localhost:${PORT}`));