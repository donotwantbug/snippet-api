const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'snippets.json');

app.use(cors());
app.use(express.json());

// 获取所有片段
app.get('/snippets', (req, res) => {
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) return res.json([]);
    try {
      res.json(JSON.parse(data));
    } catch {
      res.json([]);
    }
  });
});

// 添加新片段
app.post('/snippets', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '缺少字段' });
  }

  fs.readFile(FILE, 'utf8', (err, data) => {
    let snippets = [];
    try {
      snippets = JSON.parse(data);
    } catch {}

    snippets.push({ title, content });

    fs.writeFile(FILE, JSON.stringify(snippets, null, 2), err => {
      if (err) return res.status(500).send('写入失败');
      res.json({ success: true });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
