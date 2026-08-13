// ---------- API base URL ----------
// When served via node server.js, relative URLs work (/api/...).
// Change API_BASE if you're hosting the frontend separately from the backend.
const API_BASE = '';  // empty = same origin (e.g. http://localhost:4000)

// ---------- helpers ----------
async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (res.status === 204) return null;
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

// ---------- clock ----------
function tick() {
  const d = new Date();
  document.getElementById('clock').textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
tick();
setInterval(tick, 15000);

// ---------- state ----------
let lastMessage = '';
let contacts = [];

// ---------- contacts (via backend) ----------
async function loadContacts() {
  try {
    contacts = await api('/api/contacts');
  } catch (e) {
    contacts = [];
    console.error('loadContacts failed', e);
  }
  renderContacts();
}

async function saveContacts() {
  // Contacts are saved individually via POST/DELETE, so this is no longer used for persistence.
  // Kept for local state consistency.
}

function renderContacts() {
  const list = document.getElementById('contactsList');
  list.innerHTML = '';
  if (contacts.length === 0) {
    document.getElementById('contactNote').textContent = 'No contacts saved yet. Add someone who should hear from you first.';
  } else {
    document.getElementById('contactNote').textContent = '';
  }
  contacts.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'contact';
    row.innerHTML = `<span>${c.name} <span class="contact-meta">${c.phone}</span></span>
      <button class="remove" data-i="${i}" data-id="${c.id}">remove</button>`;
    list.appendChild(row);
  });
  list.querySelectorAll('.remove').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      try {
        await api(`/api/contacts/${id}`, { method: 'DELETE' });
        contacts.splice(parseInt(btn.dataset.i), 1);
        renderContacts();
      } catch (e) {
        console.error('delete contact failed', e);
      }
    };
  });
}

document.getElementById('addContact').onclick = async () => {
  const name = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  if (!name || !phone) return;
  try {
    const contact = await api('/api/contacts', {
      method: 'POST',
      body: JSON.stringify({ name, phone }),
    });
    contacts.push(contact);
    document.getElementById('cName').value = '';
    document.getElementById('cPhone').value = '';
    renderContacts();
  } catch (e) {
    console.error('add contact failed', e);
    document.getElementById('contactNote').textContent = `Error: ${e.message}`;
  }
};

loadContacts();

// ---------- logging ----------
function addLog(text) {
  const log = document.getElementById('log');
  log.classList.add('show');
  const item = document.createElement('div');
  item.className = 'log-item';
  const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  item.innerHTML = `<div class="log-dot"></div><div class="log-time">${t}</div><div>${text}</div>`;
  document.getElementById('logItems').prepend(item);
}

// ---------- nearby police via backend ----------
async function findPoliceStations(lat, lon) {
  try {
    const data = await api(`/api/stations?lat=${lat}&lon=${lon}`);
    return data.stations || [];
  } catch (e) {
    console.error('findPoliceStations failed', e);
    return [];
  }
}

async function reverseGeocode(lat, lon) {
  try {
    const data = await api(`/api/stations/address?lat=${lat}&lon=${lon}`);
    return data.address || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (e) {
    console.error('reverseGeocode failed', e);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

// ---------- send alert to backend ----------
async function saveAlertToBackend(lat, lon, address, message) {
  try {
    await api('/api/alerts', {
      method: 'POST',
      body: JSON.stringify({ lat, lon, address, message, notifyContacts: true }),
    });
    addLog('Alert saved to server.');
  } catch (e) {
    console.error('saveAlertToBackend failed', e);
    addLog('Alert could not be saved to server — message still shared locally.');
  }
}

// ---------- main alert flow ----------
async function runAlert() {
  document.getElementById('statusLine').textContent = 'Finding your location…';
  addLog('Alert started.');

  if (!navigator.geolocation) {
    document.getElementById('statusLine').textContent = 'This device cannot share location.';
    addLog('Location is not available on this device.');
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude: lat, longitude: lon } = pos.coords;
    addLog(`Location locked: ${lat.toFixed(5)}, ${lon.toFixed(5)}`);
    document.getElementById('statusLine').textContent = 'Looking up your address…';

    const address = await reverseGeocode(lat, lon);
    addLog(`Address matched: ${address}`);

    document.getElementById('statusLine').textContent = 'Searching for nearby police stations…';
    const stations = await findPoliceStations(lat, lon);

    const stationsCard = document.getElementById('stationsCard');
    const list = document.getElementById('stationsList');
    list.innerHTML = '';

    if (stations.length === 0) {
      addLog('No mapped police stations found nearby — showing emergency numbers instead.');
      document.getElementById('stationCount').textContent = 'none found nearby';
      stationsCard.style.display = 'block';
      list.innerHTML = `<p class="note">No police station is mapped in this area's map data. Use the emergency numbers below — 112 or 100 will route you to the right station.</p>`;
    } else {
      addLog(`${stations.length} police station${stations.length > 1 ? 's' : ''} found nearby.`);
      document.getElementById('stationCount').textContent = `${stations.length} found`;
      stationsCard.style.display = 'block';
      stations.forEach(s => {
        const row = document.createElement('div');
        row.className = 'station';
        row.innerHTML = `
          <div>
            <div class="station-name">${s.name}</div>
            <div class="station-dist">${s.distanceKm || s.dist || '?'} km away</div>
          </div>
          ${s.phone ? `<a class="btn primary" href="tel:${s.phone}">Call</a>` : `<a class="btn ghost" href="tel:100">Call 100</a>`}
        `;
        list.appendChild(row);
      });
    }

    const mapLink = `https://www.google.co.in/maps/@24.0794098,88.2484665,8.59z?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D`;
    const contactNames = contacts.length ? contacts.map(c => c.name).join(', ') : 'my trusted contacts';
    lastMessage = `I need help. I'm not safe right now.\nMy location: ${address}\nMap: ${mapLink}\nPlease call me or send help — sharing this with ${contactNames} and the nearest police station.`;

    document.getElementById('shareCard').style.display = 'block';
    document.getElementById('statusLine').textContent = 'Ready to send — tap "Share alert message" below.';
    addLog('Alert message prepared. Ready to share.');

    // Also save the alert to the backend
    await saveAlertToBackend(lat, lon, address, lastMessage);

  }, (err) => {
    document.getElementById('statusLine').textContent = 'Could not get your location. Check location permission.';
    addLog(`Location error: ${err.message}`);
  }, { enableHighAccuracy: true, timeout: 10000 });
}

document.getElementById('shareBtn').onclick = async () => {
  if (!lastMessage) return;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Safety alert', text: lastMessage });
      addLog('Share sheet opened.');
    } catch (e) { /* user cancelled */ }
  } else {
    navigator.clipboard.writeText(lastMessage);
    addLog('Sharing isn\'t supported here — message copied instead.');
    alert('Message copied — paste it into SMS or WhatsApp.');
  }
};
document.getElementById('copyBtn').onclick = () => {
  if (!lastMessage) return;
  navigator.clipboard.writeText(lastMessage);
  addLog('Message copied to clipboard.');
};

// ---------- hold-to-alert dial ----------
const dial = document.getElementById('dial');
const ring = document.getElementById('ringFill');
const CIRC = 653;
let holdTimer = null, holdStart = 0, holding = false;
const HOLD_MS = 1800;

function startHold(e) {
  e.preventDefault();
  if (holding) return;
  holding = true;
  holdStart = Date.now();
  document.getElementById('dialLabel').textContent = 'HOLD…';
  document.getElementById('dialSub').textContent = 'keep holding';
  step();
}
function step() {
  if (!holding) return;
  const elapsed = Date.now() - holdStart;
  const pct = Math.min(elapsed / HOLD_MS, 1);
  ring.style.strokeDashoffset = CIRC - CIRC * pct;
  if (pct >= 1) {
    triggerAlert();
    return;
  }
  holdTimer = requestAnimationFrame(step);
}
function cancelHold() {
  if (!holding) return;
  holding = false;
  cancelAnimationFrame(holdTimer);
  ring.style.strokeDashoffset = CIRC;
  document.getElementById('dialLabel').textContent = 'HOLD';
  document.getElementById('dialSub').textContent = 'to alert';
}
function triggerAlert() {
  holding = false;
  cancelAnimationFrame(holdTimer);
  dial.classList.add('armed');
  document.getElementById('dialLabel').textContent = 'SENT';
  document.getElementById('dialSub').textContent = 'stay safe';
  document.getElementById('pulse1').classList.add('go');
  document.getElementById('pulse2').classList.add('go');
  runAlert();
}
dial.addEventListener('mousedown', startHold);
dial.addEventListener('touchstart', startHold, { passive: false });
['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => {
  dial.addEventListener(evt, cancelHold);
});

