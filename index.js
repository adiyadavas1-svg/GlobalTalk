const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// APIs
app.get('/api/time', (req, res) => {
  res.json({ time: new Date().toLocaleString() });
});

app.get('/api/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello, ${name}!` });
});

// health
app.get('/health', (req, res) => {
  res.send('OK from Express!');
});

// start
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});