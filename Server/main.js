// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save', (req, res) => {
  const userId = req.body.userId;
  const userData = req.body.userData;

  if (!userId || !userData) {
    return res.status(400).send('User ID and data are required');
  }

  const userDir = path.join(__dirname, 'users', userId);

  // Create a directory for each user if it doesn't exist
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }

  // Generate a unique filename based on timestamp
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `data_${timestamp}.txt`;

  const filePath = path.join(userDir, filename);

  fs.writeFile(filePath, userData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving data');
    }

    console.log('Data saved successfully!');
    res.send('Data saved successfully!');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
