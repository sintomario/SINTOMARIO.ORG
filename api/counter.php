<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration
$dbFile = __DIR__ . '/counter.json';

// Initialize database if doesn't exist
if (!file_exists($dbFile)) {
    $data = [
        'visits' => 3789987456, // Starting count
        'last_reset' => date('Y-m-d'),
        'daily_visits' => 0,
        'online_users' => [],
        'last_activity' => []
    ];
    file_put_contents($dbFile, json_encode($data), LOCK_EX);
}

// Read current data
$data = json_decode(file_get_contents($dbFile), true);
$currentTime = time();
$currentDate = date('Y-m-d');

// Clean old activity (older than 5 minutes)
$data['online_users'] = array_filter($data['online_users'], function($timestamp) use ($currentTime) {
    return $currentTime - $timestamp < 300; // 5 minutes
});

// Clean old last_activity (older than 1 hour)
$data['last_activity'] = array_filter($data['last_activity'], function($timestamp) use ($currentTime) {
    return $currentTime - $timestamp < 3600; // 1 hour
});

// Handle different actions
$action = $_GET['action'] ?? 'get';

switch ($action) {
    case 'visit':
        // Increment global counter
        $data['visits']++;
        $data['daily_visits']++;
        
        // Reset daily counter if new day
        if ($data['last_reset'] !== $currentDate) {
            $data['daily_visits'] = 1;
            $data['last_reset'] = $currentDate;
        }
        
        // Add to activity log
        $data['last_activity'][] = $currentTime;
        if (count($data['last_activity']) > 100) {
            array_shift($data['last_activity']);
        }
        break;
        
    case 'heartbeat':
        // Add/update user online status
        $userIP = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $userKey = md5($userIP . $userAgent);
        
        $data['online_users'][$userKey] = $currentTime;
        break;
        
    case 'get':
    default:
        // Just return current stats
        break;
}

// Save data
file_put_contents($dbFile, json_encode($data), LOCK_EX);

// Return JSON response
echo json_encode([
    'visits' => $data['visits'],
    'online_users' => count($data['online_users']),
    'daily_visits' => $data['daily_visits'],
    'last_reset' => $data['last_reset'],
    'recent_activity' => count(array_filter($data['last_activity'], function($timestamp) use ($currentTime) {
        return $currentTime - $timestamp < 3600; // Last hour
    }))
]);
?>
