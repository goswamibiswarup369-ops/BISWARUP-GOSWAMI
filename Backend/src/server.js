require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const contactsRoutes = require('./routes/contacts');
const stationsRoutes = require('./routes/stations');
const alertsRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


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
