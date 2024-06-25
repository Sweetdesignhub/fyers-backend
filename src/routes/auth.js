const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/callback', async (req, res) => {
  const authCode = req.query.code;

  try {
    if (!authCode) {
      return res.status(400).json({ error: 'Authorization code not found' });
    }

    // Exchange authorization code for access token
    const response = await axios.post('https://api.fyers.in/api/v3/token', {
      client_id: '710RYAUI5Z-100',
      secret_key: 'JV4OW75KGT',
      grant_type: 'authorization_code',
      code: authCode,
    });

    // Send access token to frontend
    res.json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error('Error exchanging auth code for access token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
