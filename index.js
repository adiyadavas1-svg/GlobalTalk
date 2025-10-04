const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// static files
app.use(express.static(path.join(__dirname, 'public')));

// main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// health check
app.get('/health', (req, res) => {
  res.send('OK from Express!');
});

// time API
app.get('/api/time', (req, res) => {
  res.json({ time: new Date().toLocaleString().toLowerCase() });
});

// hello API (name param)
app.get('/api/hello/:name', (req, res) => {
  const name = req.params.name?.trim() || 'friend';
  res.json({ message: `Hello, ${name}!` });
});

// NEW: random joke API
const jokes = [
  'Why did the developer go broke? Because he used up all his cache.',
  'I would tell you a UDP joke, but you might not get it.',
  'There are 10 kinds of people: those who understand binary and those who don’t.',
  'Backend ke bina frontend bilkul chai bina shakkar ☕🙂'
];
app.get('/api/joke', (req, res) => {
  const idx = Math.floor(Math.random() * jokes.length);
  res.json({ joke: jokes[idx] });
});

// start server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});