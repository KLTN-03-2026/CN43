// Common API utilities

const API_BASE = "";

let token = localStorage.getItem("jp_token") || "";
let user = null;  // Global user object

function setToken(newToken) {
  token = newToken;
  if (newToken) {
    localStorage.setItem("jp_token", newToken);
  } else {
    localStorage.removeItem("jp_token");
  }
}

function getAuthHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

// Export for use in other files
window.API = { apiRequest, setToken, getAuthHeaders };