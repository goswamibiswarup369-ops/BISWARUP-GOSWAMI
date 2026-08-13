const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { sendSMS, isConfigured } = require('../services/sms');

// GET /api/alerts - history, most recent first
router.get('/', (req, res) => {
  const alerts = db.getAlerts().slice().reverse();
  res.json(alerts);
});

// POST /api/alerts
// body: { lat, lon, address, message, notifyContacts: bool }
// Stores the alert and (if configured) sends a real SMS to every saved
// trusted contact plus, where available, the nearest police station.
router.post('/', async (req, res) => {
  const { lat, lon, address, message } = req.body;
  if (lat == null || lon == null || !message) {
    return res.status(400).json({ error: 'lat, lon and message are required' });
  }

  const contacts = db.getContacts();
  const smsResults = [];

  if (req.body.notifyContacts !== false) {
    for (const contact of contacts) {
      const result = await sendSMS(contact.phone, message);
      smsResults.push({ contact: contact.name, phone: contact.phone, ...result });
    }
  }

  const alert = db.addAlert({
    lat,
    lon,
    address: address || null,
    message,
    smsResults,
    smsEnabled: isConfigured
  });

  res.status(201).json(alert);
});

module.exports = router;
