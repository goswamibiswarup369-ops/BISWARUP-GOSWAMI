// Lightweight file-based "database" so the project runs anywhere with zero
// native dependencies. Swap this out for Postgres/Mongo/etc. in production —
// every function below is the only place that would need to change.

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { contacts: [], alerts: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function nextId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

module.exports = {
  // ---- contacts ----
  getContacts() {
    return readDB().contacts;
  },
  addContact({ name, phone }) {
    const db = readDB();
    const contact = { id: nextId(db.contacts), name, phone, createdAt: new Date().toISOString() };
    db.contacts.push(contact);
    writeDB(db);
    return contact;
  },
  deleteContact(id) {
    const db = readDB();
    db.contacts = db.contacts.filter(c => c.id !== Number(id));
    writeDB(db);
  },

  // ---- alerts ----
  getAlerts() {
    return readDB().alerts;
  },
  addAlert(alert) {
    const db = readDB();
    const record = {
      id: nextId(db.alerts),
      createdAt: new Date().toISOString(),
      ...alert
    };
    db.alerts.push(record);
    writeDB(db);
    return record;
  }
};
