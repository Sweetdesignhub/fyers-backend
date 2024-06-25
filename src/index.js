// const express = require("express");
// const { KiteConnect } = require("kiteconnect");
// require("dotenv").config();

// const app = express();
// const PORT = 8080;

// app.use(express.json());

// const apiKey = process.env.KITE_API_KEY;
// const apiSecret = process.env.KITE_API_SECRET;

// console.log('apikey : ', apiKey);
// console.log('apisecret : ', apiSecret);

// if (!apiKey || !apiSecret) {
//   console.error("KITE_API_KEY or KITE_API_SECRET is not defined in environment variables");
//   process.exit(1);
// }

// const kc = new KiteConnect({
//   api_key: apiKey,
// });

// let accessToken;

// app.get("/login", (req, res) => {
//   const loginURL = kc.getLoginURL();
//   res.redirect(loginURL);
// });

// app.get("/redirecturl", (req, res) => {
//   const requestToken = req.query.request_token;
//   if (!requestToken) {
//     return res.status(400).send("Request token is missing");
//   }

//   kc.generateSession(requestToken, apiSecret)
//     .then(async (session) => {
//       console.log(session);
//       accessToken = session.access_token;
//       kc.setAccessToken(accessToken);

//       try {
//         const profile = await kc.getProfile();
//         console.log(profile);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       }
//       res.send("Login successful. You can now access other routes.");
//     })
//     .catch((err) => {
//       console.error("Error generating session:", err);
//       res.status(500).send("Error in login: " + err.message);
//     });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}/login`);
// });

const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

