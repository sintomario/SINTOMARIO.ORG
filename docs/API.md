# API Documentation - SINTOMARIO.ORG Counter System

## 📊 Overview
Sistema de tracking en tiempo real para visitas globales y usuarios online usando PHP + JSON.

## 🔗 Endpoints

### GET `/api/counter.php`

#### Parámetros
- `action` (string): Tipo de operación
  - `get` - Obtener estadísticas actuales (default)
  - `visit` - Registrar nueva visita
  - `heartbeat` - Mantener usuario online

#### Responses

**Success (200)**
```json
{
  "visits": 3789987456,
  "online_users": 12,
  "daily_visits": 1247,
  "last_reset": "2026-04-06",
  "recent_activity": 89
}
```

**Error (500)**
```json
{
  "error": "Database write failed",
  "code": 500
}
```

## 🗄️ Database Schema

### `counter.json`
```json
{
  "visits": 3789987456,           // Total visitas históricas
  "last_reset": "2026-04-06",     // Último reset diario
  "daily_visits": 1247,          // Visitas hoy
  "online_users": {               // Usuarios online por hash
    "md5(ip+userAgent)": timestamp,
    "abc123...": 1723024800
  },
  "last_activity": [1723024800, 1723024900] // Activity timestamps
}
```

## ⚙️ Configuration

### Timeouts
- **Online users**: 5 minutos (300 segundos)
- **Recent activity**: 1 hora (3600 segundos)
- **Daily reset**: 00:00 UTC

### Security
- **CORS**: `Access-Control-Allow-Origin: *`
- **Content-Type**: `application/json`
- **Locking**: `LOCK_EX` para escritura atómica

## 🔧 Implementation Details

### Visit Registration
```php
case 'visit':
  $data['visits']++;              // Increment global
  $data['daily_visits']++;        // Increment daily
  
  // Reset if new day
  if ($data['last_reset'] !== $currentDate) {
    $data['daily_visits'] = 1;
    $data['last_reset'] = $currentDate;
  }
  
  $data['last_activity'][] = $currentTime;
  break;
```

### Heartbeat System
```php
case 'heartbeat':
  $userIP = $_SERVER['REMOTE_ADDR'];
  $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
  $userKey = md5($userIP . $userAgent);
  
  $data['online_users'][$userKey] = $currentTime;
  break;
```

### Cleanup Process
```php
// Remove old online users (5+ min)
$data['online_users'] = array_filter($data['online_users'], 
  function($timestamp) use ($currentTime) {
    return $currentTime - $timestamp < 300;
  });

// Remove old activity (1+ hour)  
$data['last_activity'] = array_filter($data['last_activity'],
  function($timestamp) use ($currentTime) {
    return $currentTime - $timestamp < 3600;
  });
```

## 🚀 Frontend Integration

### JavaScript Client
```javascript
// Async IIFE pattern
(async function() {
  let globalVisits = 0;
  let onlineUsers = 0;
  
  // Fetch data
  async function fetchCounter() {
    try {
      const response = await fetch('/api/counter.php?action=get');
      const data = await response.json();
      globalVisits = data.visits;
      onlineUsers = data.online_users;
      updateFooter();
    } catch (error) {
      console.log('Counter API unavailable');
      // Show error state
    }
  }
  
  // Register visit
  async function registerVisit() {
    try {
      await fetch('/api/counter.php?action=visit');
      await fetchCounter();
    } catch (error) {
      console.log('Failed to register visit');
    }
  }
  
  // Heartbeat every 2 minutes
  function sendHeartbeat() {
    fetch('/api/counter.php?action=heartbeat').catch(() => {});
  }
  
  // Initialize
  await fetchCounter();
  await registerVisit();
  setInterval(sendHeartbeat, 120000);
  setInterval(fetchCounter, 30000);
})();
```

## 📊 Monitoring

### Metrics Available
- **Total visits**: Counter histórico acumulado
- **Daily visits**: Visitas en el día actual
- **Online users**: Usuarios activos últimos 5 min
- **Recent activity**: Interacciones última hora

### Health Checks
```bash
# Test API endpoint
curl "http://sintomario.org/api/counter.php?action=get"

# Check response time
time curl -s "http://sintomario.org/api/counter.php"
```

## 🔒 Security Considerations

### Current Implementation
- ✅ No authentication required (public counter)
- ✅ Rate limiting por IP implícito (5 min timeout)
- ✅ No sensitive data exposure
- ✅ Atomic file operations

### Future Enhancements
- 🔄 Rate limiting configurable
- 🔄 IP-based abuse detection
- 🔄 Analytics dashboard
- 🔄 Export functionality

## 🐛 Troubleshooting

### Common Issues

**Permission Denied**
```bash
# Fix file permissions
chmod 666 api/counter.json
chown www-data:www-data api/counter.json
```

**JSON Corrupted**
```bash
# Reset database
echo '{"visits":0,"last_reset":"'$(date -I)'","daily_visits":0,"online_users":[],"last_activity":[]}' > api/counter.json
```

**High Memory Usage**
```bash
# Trim activity array
# Automatically limited to 100 entries in code
```

### Debug Mode
Add to `counter.php` for debugging:
```php
// Debug logging
error_log("Counter action: " . $action);
error_log("Current visits: " . $data['visits']);
```

---

**Version**: 1.0  
**Last Updated**: 6 Abr 2026  
**Status**: Production Ready
