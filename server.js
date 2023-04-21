const express = require('express');
const cors = require('cors');
const path = require('path');
const { getAccessToken, searchTracks, addTrackToQueue } = require('./spotify');

const config = require('./config');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${config.client_id}&response_type=code&redirect_uri=${encodeURIComponent(config.redirect_uri)}&scope=playlist-read-private%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const accessToken = await getAccessToken(code);
    res.redirect(`/index.html?access_token=${accessToken}`);
  } catch (err) {
    res.status(500).send('Error obtaining access token');
  }
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const accessToken = req.query.access_token;
  try {
    const tracks = await searchTracks(query, accessToken);
    res.json(tracks);
  } catch (err) {
    res.status(500).send('Error searching for tracks');
  }
});

app.get('/queue', async (req, res) => {
  const uri = req.query.uri;
  const accessToken = req.query.access_token;
  try {
    await addTrackToQueue(uri, accessToken);
    res.status(200).send('Track added to queue');
  } catch (err) {
    res.status(500).send('Error adding track to queue');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
