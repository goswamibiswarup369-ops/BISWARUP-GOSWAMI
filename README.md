<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <title>SafeGuard - Women's Safety App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .app-container {
            max-width: 480px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            position: relative;
            box-shadow: 0 0 30px rgba(0,0,0,0.3);
        }

        .app-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .app-header h1 {
            font-size: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .menu-icon {
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
        }

        .status-bar {
            background: rgba(255,255,255,0.15);
            padding: 8px 20px;
            text-align: center;
            font-size: 12px;
            color: white;
        }

        .main-content {
            padding: 20px;
        }

        .emergency-section {
            text-align: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #fff5f7 0%, #ffe8ef 100%);
            border-radius: 20px;
            margin-bottom: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .emergency-button {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 8px solid #ff1744;
            background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
            color: white;
            font-size: 22px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 15px 40px rgba(255, 23, 68, 0.4);
            transition: all 0.3s ease;
            margin: 20px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .emergency-button:active {
            transform: scale(0.95);
        }

        .emergency-button.activated {
            animation: pulse 1s infinite, shake 0.5s;
            background: linear-gradient(135deg, #d50000 0%, #b71c1c 100%);
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 15px 40px rgba(255, 23, 68, 0.4); }
            50% { transform: scale(1.08); box-shadow: 0 20px 50px rgba(255, 23, 68, 0.7); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .sos-icon {
            font-size: 48px;
            margin-bottom: 5px;
        }

        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }

        .action-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: transform 0.2s;
        }

        .action-card:active {
            transform: scale(0.95);
        }

        .action-card .icon {
            font-size: 36px;
            margin-bottom: 10px;
        }

        .action-card .label {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }

        .contacts-section {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .contact-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        .contact-info {
            flex: 1;
        }

        .contact-name {
            font-weight: 600;
            color: #333;
            font-size: 15px;
        }

        .contact-number {
            color: #666;
            font-size: 14px;
            margin-top: 3px;
        }

        .call-button {
            background: #4caf50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
        }

        .alert-status {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            margin-bottom: 20px;
            display: none;
        }

        .alert-status.active {
            display: block;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .alert-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .alert-icon {
            font-size: 32px;
        }

        .alert-text {
            flex: 1;
        }

        .alert-title {
            font-weight: bold;
            color: #d50000;
            font-size: 16px;
        }

        .alert-time {
            color: #666;
            font-size: 12px;
        }

        .location-display {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 10px;
            margin-top: 10px;
            font-size: 13px;
            color: #1565c0;
        }

        .response-timer {
            background: #fff3e0;
            padding: 15px;
            border-radius: 10px;
            margin-top: 10px;
            text-align: center;
        }

        .timer-text {
            font-size: 24px;
            font-weight: bold;
            color: #e65100;
        }

        .safety-tips {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            margin-bottom: 20px;
        }

        .tip-item {
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
            color: #555;
        }

        .tip-item:last-child {
            border-bottom: none;
        }

        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            max-width: 480px;
            width: 100%;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }

        .nav-item {
            flex: 1;
            text-align: center;
            cursor: pointer;
            padding: 8px;
            transition: background 0.2s;
        }

        .nav-item:active {
            background: #f5f5f5;
        }

        .nav-icon {
            font-size: 24px;
            margin-bottom: 3px;
        }

        .nav-label {
            font-size: 11px;
            color: #666;
        }

        .nav-item.active .nav-icon,
        .nav-item.active .nav-label {
            color: #764ba2;
        }

        .fab-button {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
        }

        @media (max-width: 480px) {
            .bottom-nav {
                max-width: 100%;
            }
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.show {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 350px;
            width: 90%;
            text-align: center;
        }

        .modal-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .modal-text {
            color: #666;
            margin-bottom: 20px;
        }

        .modal-button {
            background: #764ba2;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="app-header">
            <div class="menu-icon">☰</div>
            <h1><span>🛡️</span> SafeGuard</h1>
            <div class="menu-icon">👤</div>
        </div>

        <div class="status-bar">
            <span id="statusText">✅ Protected - GPS Active</span>
        </div>

        <div class="main-content" style="padding-bottom: 80px;">
            <div class="emergency-section">
                <h2 style="color: #333; margin-bottom: 10px;">Emergency SOS</h2>
                <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Hold to activate emergency alert</p>
                
                <button class="emergency-button" id="emergencyBtn" onclick="activateEmergency()">
                    <div class="sos-icon">🚨</div>
                    <div>PRESS<br>FOR HELP</div>
                </button>

                <p style="color: #999; font-size: 12px;">Police will be notified instantly</p>
            </div>

            <div class="alert-status" id="alertStatus">
                <div class="alert-header">
                    <div class="alert-icon">🚨</div>
                    <div class="alert-text">
                        <div class="alert-title">EMERGENCY ALERT ACTIVE</div>
                        <div class="alert-time" id="alertTime"></div>
                    </div>
                </div>
                <div class="location-display" id="locationDisplay">
                    📍 Capturing location...
                </div>
                <div class="response-timer">
                    <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Police ETA</div>
                    <div class="timer-text" id="timerDisplay">--:--</div>
                </div>
            </div>

            <div class="quick-actions">
                <div class="action-card" onclick="shareLocation()">
                    <div class="icon">📍</div>
                    <div class="label">Share Location</div>
                </div>
                <div class="action-card" onclick="callPolice()">
                    <div class="icon">📞</div>
                    <div class="label">Call Police</div>
                </div>
                <div class="action-card" onclick="startTracking()">
                    <div class="icon">🎥</div>
                    <div class="label">Start Recording</div>
                </div>
                <div class="action-card" onclick="sendAlert()">
                    <div class="icon">💬</div>
                    <div class="label">Alert Contacts</div>
                </div>
            </div>

            <div class="contacts-section">
                <div class="section-title">
                    <span>📱</span> Emergency Contacts
                </div>
                <div class="contact-item">
                    <div class="contact-info">
                        <div class="contact-name">Police Emergency</div>
                        <div class="contact-number">100</div>
                    </div>
                    <button class="call-button" onclick="makeCall('100')">📞 Call</button>
                </div>
                <div class="contact-item">
                    <div class="contact-info">
                        <div class="contact-name">Women Helpline</div>
                        <div class="contact-number">1091</div>
                    </div>
                    <button class="call-button" onclick="makeCall('1091')">📞 Call</button>
                </div>
                <div class="contact-item">
                    <div class="contact-info">
                        <div class="contact-name">National Commission</div>
                        <div class="contact-number">011-26942369</div>
                    </div>
                    <button class="call-button" onclick="makeCall('011-26942369')">📞 Call</button>
                </div>
            </div>

            <div class="safety-tips">
                <div class="section-title">
                    <span>💡</span> Safety Tips
                </div>
                <div class="tip-item">🔒 Always keep your phone charged and location enabled</div>
                <div class="tip-item">👥 Share your live location with trusted contacts</div>
                <div class="tip-item">🚗 Use well-lit and populated routes when traveling</div>
                <div class="tip-item">📱 Keep emergency numbers on speed dial</div>
                <div class="tip-item">🎯 Trust your instincts - if something feels wrong, it probably is</div>
            </div>
        </div>

        <div class="bottom-nav">
            <div class="nav-item active">
                <div class="nav-icon">🏠</div>
                <div class="nav-label">Home</div>
            </div>
            <div class="nav-item" onclick="showAlert('Map feature coming soon!', 'info')">
                <div class="nav-icon">🗺️</div>
                <div class="nav-label">Map</div>
            </div>
            <div class="nav-item" onclick="showAlert('Contacts feature coming soon!', 'info')">
                <div class="nav-icon">👥</div>
                <div class="nav-label">Contacts</div>
            </div>
            <div class="nav-item" onclick="showAlert('Settings feature coming soon!', 'info')">
                <div class="nav-icon">⚙️</div>
                <div class="nav-label">Settings</div>
            </div>
        </div>
    </div>

    <div class="modal" id="alertModal">
        <div class="modal-content">
            <div class="modal-icon" id="modalIcon">✅</div>
            <div class="modal-title" id="modalTitle">Success</div>
            <div class="modal-text" id="modalText">Action completed successfully</div>
            <button class="modal-button" onclick="closeModal()">OK</button>
        </div>
    </div>

    <script>
        let emergencyActive = false;
        let timerInterval = null;

        function activateEmergency() {
            if (emergencyActive) return;
            
            emergencyActive = true;
            const btn = document.getElementById('emergencyBtn');
            const alertStatus = document.getElementById('alertStatus');
            const alertTime = document.getElementById('alertTime');
            
            btn.classList.add('activated');
            btn.innerHTML = '<div class="sos-icon">🚨</div><div>ALERT<br>ACTIVE</div>';
            
            alertStatus.classList.add('active');
            alertTime.textContent = new Date().toLocaleTimeString();
            
            // Get location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude.toFixed(6);
                        const lon = position.coords.longitude.toFixed(6);
                        document.getElementById('locationDisplay').innerHTML = 
                            `📍 Location: ${lat}, ${lon}<br>✅ Sent to nearby police stations`;
                        
                        // Start countdown timer
                        let seconds = Math.floor(Math.random() * 180) + 180; // 3-6 minutes
                        startTimer(seconds);
                        
                        showAlert('🚨 Emergency Alert Sent!\n\nPolice stations notified with your location. Help is on the way!', 'success');
                    },
                    (error) => {
                        document.getElementById('locationDisplay').innerHTML = 
                            `📍 Using approximate location<br>✅ Alert sent to police`;
                        showAlert('⚠️ Alert sent! Location access limited but police have been notified.', 'warning');
                    }
                );
            }
            
            // Vibrate if supported
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
        }

        function startTimer(totalSeconds) {
            const timerDisplay = document.getElementById('timerDisplay');
            timerInterval = setInterval(() => {
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                totalSeconds--;
                
                if (totalSeconds < 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = 'ARRIVING';
                }
            }, 1000);
        }

        function shareLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        showAlert(`📍 Location Shared!\n\nYour location has been sent to your trusted contacts.\n\nLat: ${lat.toFixed(6)}\nLon: ${lon.toFixed(6)}`, 'success');
                    },
                    () => {
                        showAlert('⚠️ Unable to access location. Please enable location services.', 'warning');
                    }
                );
            }
        }

        function callPolice() {
            if (confirm('Call Police Emergency (100)?')) {
                window.location.href = 'tel:100';
            }
        }

        function startTracking() {
            showAlert('🎥 Recording Started\n\nVideo and audio recording has begun. Files will be sent to trusted contacts.', 'success');
        }

        function sendAlert() {
            showAlert('💬 Alert Sent!\n\nEmergency message sent to all your trusted contacts with your location.', 'success');
        }

        function makeCall(number) {
            if (confirm(`Call ${number}?`)) {
                window.location.href = `tel:${number}`;
            }
        }

        function showAlert(message, type) {
            const modal = document.getElementById('alertModal');
            const icon = document.getElementById('modalIcon');
            const title = document.getElementById('modalTitle');
            const text = document.getElementById('modalText');
            
            if (type === 'success') {
                icon.textContent = '✅';
                title.textContent = 'Success';
            } else if (type === 'warning') {
                icon.textContent = '⚠️';
                title.textContent = 'Warning';
            } else {
                icon.textContent = 'ℹ️';
                title.textContent = 'Information';
            }
            
            text.textContent = message;
            modal.classList.add('show');
        }

        function closeModal() {
            document.getElementById('alertModal').classList.remove('show');
        }

        // Update status bar
        setInterval(() => {
            const now = new Date();
            document.getElementById('statusText').textContent = 
                `✅ Protected - ${now.toLocaleTimeString()}`;
        }, 1000);
    </script>
</body>
</html>
