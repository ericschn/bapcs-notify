const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>API running</h1>');
});

app.listen (port, () => {
  console.log(`API running on port ${port}`);
})