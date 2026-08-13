require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const contactsRoutes = require('./src/routes/contacts');
const stationsRoutes = require('./src/routes/stations');
const alertsRoutes = require('./src/routes/alerts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend as static files too, so `node server.js` alone is
// enough to run the whole app on http://localhost:3000
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/contacts', contactsRoutes);
app.use('/api/stations', stationsRoutes);
app.use('/api/alerts', alertsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Rakshak Line backend running at http://localhost:${PORT}`);
});
