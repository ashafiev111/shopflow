function getToken() {
  try { return localStorage.getItem('jwt'); } catch(e) { return null; }
}

function setToken(token) {
  if (token) localStorage.setItem('jwt', token);
  else localStorage.removeItem('jwt');
}

function fetchWithAuth(url, options) {
  options = options || {};
  options.headers = options.headers || {};
  var token = getToken();
  if (token) options.headers['Authorization'] = 'Bearer ' + token;
  return fetch(url, options);
}
