// SINTOMARIO.ORG - Global Counter System
(function() {
  function updateGlobalCounter() {
    // Increment counter and get updated value
    fetch('/api/counter.php?action=visit')
      .then(response => response.json())
      .then(data => {
        const visitsEl = document.getElementById("visits");
        const onlineEl = document.getElementById("online");
        if (visitsEl) {
          visitsEl.textContent = data.visits.toLocaleString("es-ES");
        }
        if (onlineEl) {
          onlineEl.textContent = data.online_users.toLocaleString("es-ES");
        }
      })
      .catch(error => {
        console.error('Error updating counter:', error);
        // Fallback: show basic message
        const visitsEl = document.getElementById("visits");
        const onlineEl = document.getElementById("online");
        if (visitsEl) {
          visitsEl.textContent = "Conectando...";
        }
        if (onlineEl) {
          onlineEl.textContent = "--";
        }
      });
  }
  
  function fetchCounter() {
    fetch('/api/counter.php?action=get')
      .then(response => response.json())
      .then(data => {
        const visitsEl = document.getElementById("visits");
        const onlineEl = document.getElementById("online");
        if (visitsEl) {
          visitsEl.textContent = data.visits.toLocaleString("es-ES");
        }
        if (onlineEl) {
          onlineEl.textContent = data.online_users.toLocaleString("es-ES");
        }
      })
      .catch(error => {
        console.error('Error fetching counter:', error);
      });
  }
  
  // Update counter immediately when page loads
  updateGlobalCounter();
  
  // Update every 30 seconds
  setInterval(fetchCounter, 30000);
  
  // Send heartbeat every 2 minutes
  setInterval(() => {
    fetch('/api/counter.php?action=heartbeat').catch(() => {});
  }, 120000);
})();
