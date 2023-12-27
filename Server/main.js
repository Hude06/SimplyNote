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
let newUser = false;
const clientId = '3f9756c0e365406b866a';
const clientSecret = '2657f125505c135d73786f452d7095edefd71ad4'
let currentOnlineUsers = ["NoName"];
app.use(cors({ origin: [ "*","http://127.0.0.1:1430"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/callback/exchange', (req, res) => {
  const code = req.query.code;

  // Exchange the code for an access token
  const tokenEndpoint = 'https://github.com/login/oauth/access_token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUrl,
  });

  fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: params.toString(),
  })
    .then(response => response.json())
    .then(data => {
      const accessToken = data.access_token;

      // Use the access token to fetch user data from GitHub
      const apiUrl = 'https://api.github.com/user';

      return fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'SimplyNote',
        },
      });
    })
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

  const pages = [];

  fs.readdirSync(userDir).forEach(file => {
    const filePath = path.join(userDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    pages.push({ filename: file, content });
  });

  // Send the list of pages with content as a response
  res.json({ pages });
});
app.get('/online', (req,res) => {
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
