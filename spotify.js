const axios = require('axios');
const config = require('./config');

async function getAccessToken(code) {
  const response = await axios.post('https://accounts.spotify.com/api/token', null, {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirect_uri,
    },
    headers: {
      'Authorization': 'Basic ' + Buffer.from(config.client_id + ':' + config.client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

async function searchTracks(query, accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    params: {
      q: query,
      type: 'track',
      limit: 10,
    },
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  });

  return response.data.tracks.items;
}

async function addTrackToQueue(uri, accessToken) {
  await axios.post('https://api.spotify.com/v1/me/player/queue', null, {
    params: { uri },
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  });
}

module.exports = {
  getAccessToken,
  searchTracks,
  addTrackToQueue,
};
