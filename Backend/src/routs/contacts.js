const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/contacts
router.get('/', (req, res) => {
  res.json(db.getContacts());
});

// POST /api/contacts  { name, phone }
router.post('/', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'name and phone are required' });
  }
  const contact = db.addContact({ name, phone });
  res.status(201).json(contact);
});

// DELETE /api/contacts/:id
router.delete('/:id', (req, res) => {
  db.deleteContact(req.params.id);
  res.status(204).end();
});

module.exports = router;
