# 🛡️ Rakshak Line — Personal Safety Alert System

> **A full-stack personal safety web application designed to help users quickly share their location and emergency alert with trusted contacts and identify nearby police stations.**

Rakshak Line is a safety-focused web application that provides a simple **hold-to-alert interface** for emergency situations. When the user presses and holds the emergency dial, the application obtains the user's current location, converts the coordinates into a readable address, searches for nearby police stations, prepares an emergency message, and stores the alert through the backend.

The project combines a lightweight frontend with a Node.js/Express backend and external location/SMS services.

---

## 🚨 Key Features

* 🔴 **Hold-to-Alert Emergency Dial**

  * Press and hold the emergency button to prevent accidental activation.
  * Visual progress indicator shows the alert activation process.

* 📍 **Live Location Detection**

  * Uses the browser's Geolocation API to obtain the user's current latitude and longitude.

* 🏢 **Nearby Police Station Finder**

  * Searches for nearby police stations using OpenStreetMap data.
  * Calculates approximate distance using the Haversine formula.
  * Displays nearby stations and available phone numbers.

* 🗺️ **Location Reverse Geocoding**

  * Converts latitude and longitude into a readable address using OpenStreetMap's Nominatim service.

* 👥 **Trusted Contacts**

  * Add trusted contacts with their name and phone number.
  * Contacts are stored through the backend.
  * Contacts can be removed whenever required.

* 📱 **Emergency Alert Sharing**

  * Generates an emergency message containing the user's location and map information.
  * Uses the browser's native Share API where supported.
  * Provides a copy-to-clipboard fallback.

* 💬 **SMS Notification Support**

  * Optional Twilio integration allows emergency messages to be sent to saved trusted contacts.
  * Without Twilio credentials, the application continues working in development mode without sending real SMS.

* 📝 **Alert History**

  * Emergency alerts are stored on the backend with location, address, message, and timestamp information.

* ❤️ **Emergency Numbers**

  * Quick access to emergency numbers such as 112 and 100.

* 📊 **Alert Log**

  * Displays the progress of the alert process, including location detection, station lookup, and message preparation.

* 🔌 **REST API**

  * Frontend and backend communicate through RESTful API endpoints.

---

## 🏗️ How It Works

```text
User
 │
 │ Press & Hold Emergency Dial
 ▼
Frontend
 │
 │ Browser Geolocation API
 ▼
Current Location
 │
 ├──────────────► Reverse Geocoding
 │                 │
 │                 ▼
 │              Address
 │
 ├──────────────► OpenStreetMap / Overpass
 │                 │
 │                 ▼
 │          Nearby Police Stations
 │
 ▼
Emergency Message
 │
 ├──────────────► Trusted Contacts
 │
 ├──────────────► Native Share / Clipboard
 │
 ▼
Express Backend
 │
 ├──────────────► File-based Database
 │
 └──────────────► Optional Twilio SMS
```

---

## 🧰 Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)
* Browser Geolocation API
* Web Share API
* Clipboard API

### Backend

* Node.js
* Express.js
* REST APIs
* CORS
* dotenv
* node-fetch

### External Services

* OpenStreetMap / Overpass API — nearby police station data
* OpenStreetMap Nominatim — reverse geocoding
* Twilio — optional SMS notification service

### Data Storage

* JSON-based file storage

---

## 📁 Project Structure

```text
BISWARUP-GOSWAMI/
│
├── Backend/
│   └── src/
│       ├── db/
│       │   ├── data.json
│       │   └── db.js
│       │
│       ├── routs/
│       │   ├── alerts.js
│       │   ├── contacts.js
│       │   └── stations.js
│       │
│       ├── services/
│       │   └── sms.js
│       │
│       ├── package.json
│       └── server.js
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
├── Todo.md
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/goswamibiswarup369-ops/BISWARUP-GOSWAMI.git
```

### 2. Navigate to the Backend

```bash
cd BISWARUP-GOSWAMI/Backend/src
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

The application will normally be available at:

```text
http://localhost:3000
```

The backend is configured to serve the frontend as static files, so you don't need to run a separate frontend server.

---

## 🔐 Optional Twilio Configuration

To enable real SMS notifications, configure your Twilio credentials using environment variables.

Create a `.env` file in the backend directory:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=your_twilio_number
```

Without these credentials, the application runs in development mode and logs the SMS operation instead of sending a real message.

**Never commit your `.env` file or API credentials to GitHub.**

---

## 🔗 API Endpoints

### Health Check

```http
GET /api/health
```

Returns the current backend health status.

---

### Trusted Contacts

#### Get Contacts

```http
GET /api/contacts
```

#### Add Contact

```http
POST /api/contacts
```

Request body:

```json
{
  "name": "Emergency Contact",
  "phone": "+919876543210"
}
```

#### Delete Contact

```http
DELETE /api/contacts/:id
```

---

### Police Stations

#### Find Nearby Police Stations

```http
GET /api/stations?lat=<latitude>&lon=<longitude>
```

The backend searches OpenStreetMap data and returns nearby police stations sorted by distance.

#### Reverse Geocode

```http
GET /api/stations/address?lat=<latitude>&lon=<longitude>
```

Returns a readable address for the provided coordinates.

---

### Emergency Alerts

#### Get Alert History

```http
GET /api/alerts
```

#### Create Emergency Alert

```http
POST /api/alerts
```

Example request:

```json
{
  "lat": 23.1234,
  "lon": 88.5678,
  "address": "Example Location",
  "message": "I need help. I'm not safe right now.",
  "notifyContacts": true
}
```

---

## 🗄️ Data Storage

For simplicity, this project uses a lightweight JSON-based database instead of MongoDB or PostgreSQL.

The database stores:

* Trusted contacts
* Emergency alerts
* Alert timestamps
* Location coordinates
* Addresses
* SMS results

This approach makes the project easy to run locally without requiring an external database server.

For production deployment, the storage layer can be replaced with:

* MongoDB
* PostgreSQL
* MySQL
* Firebase
* Supabase

---

## 🔒 Safety & Privacy Considerations

Rakshak Line is currently a **working prototype** and should not be considered a replacement for official emergency services.

The application:

* Uses the device's browser location permission.
* Does not automatically dispatch police officers.
* Depends on available OpenStreetMap data for nearby police stations.
* Requires a properly configured SMS provider for real SMS delivery.
* Should use HTTPS in production.
* Should protect sensitive user information and credentials.

In an actual emergency, users should contact official emergency services directly.

---

## 🚀 Future Improvements

Planned improvements could include:

* [ ] User authentication and secure accounts
* [ ] MongoDB/PostgreSQL production database
* [ ] Real-time location tracking
* [ ] Automatic SMS and WhatsApp integration
* [ ] Push notifications
* [ ] Police/admin dashboard
* [ ] Interactive map integration
* [ ] Emergency alert cancellation mechanism
* [ ] Multi-language support
* [ ] PWA/mobile application version
* [ ] Improved privacy and encryption
* [ ] Production-grade monitoring and logging

---

## 🎯 Project Goals

The main goals of Rakshak Line are to:

1. Reduce the number of steps required to initiate a safety alert.
2. Make location sharing easier during stressful situations.
3. Help users identify nearby police stations.
4. Provide a way to notify trusted contacts.
5. Demonstrate how frontend, backend, geolocation, APIs, and SMS services can work together in a real-world application.

---

## 💡 What I Learned

Building this project helped me understand and implement:

* Full-stack web application architecture
* REST API development with Express.js
* Frontend-backend integration
* Browser Geolocation API
* Asynchronous JavaScript and Fetch API
* External API integration
* Reverse geocoding
* Location-based searching
* Haversine distance calculation
* JSON-based data persistence
* SMS API integration with Twilio
* Error handling and fallback mechanisms
* Responsive UI development

---

## 👨‍💻 Author

### Biswarup Goswami

Computer Science & Engineering Student
Full-Stack / Frontend Developer

* GitHub: [@goswamibiswarup369-ops](https://github.com/goswamibiswarup369-ops)
* Repository: [BISWARUP-GOSWAMI](https://github.com/goswamibiswarup369-ops/BISWARUP-GOSWAMI)

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## ⚠️ Disclaimer

**Rakshak Line is an educational and demonstration prototype.**

It is not connected to an official police dispatch system and should not be relied upon as the sole method of obtaining emergency assistance. In an immediate emergency, contact the appropriate official emergency service directly.

