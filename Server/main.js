// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors middleware
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const app = express();
const port = 3500;
let currentOnlineUsers = ["NoName"];
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/save', (req, res) => {
  const userId = req.body.userId;
  const userData = req.body.userData;
  const page = req.body.pageSending;
  for (let i = 0; i < currentOnlineUsers.length; i++) {
  }
  if (!userId || !userData) {
    return res.status(400).send('User ID and data are required');
  }


  const userDir = path.join(__dirname, 'users', userId);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }

  const filename = page + ".txt";
  const filePath = path.join(userDir, filename);

  fs.writeFile(filePath, userData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving data');
    }

    res.status(200).send('Data saved successfully!');
  });
});

// Request all pages for a user endpoint
app.get('/pages/:userId', (req, res) => {
  const userId = req.params.userId;
  const userDir = path.join(__dirname, 'users', userId);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
    return res.send('User not found, Creating User');
  }
  console.log("Getting Pages")
  const pages = [];

  fs.readdirSync(userDir).forEach(file => {
    const filePath = path.join(userDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    pages.push({ filename: file, content });
  });

  // Send the list of pages with content as a response
  res.json({ pages });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
