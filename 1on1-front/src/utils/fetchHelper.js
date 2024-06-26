function fetchWithToken(url, payload, options = {}) {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`
        };
    }
    
    const baseUrl = 'http://127.0.0.1:8000/';
    const fullUrl = baseUrl + url;
    
    options.body = JSON.stringify(payload);
    
    return fetch(fullUrl, options);
}

export default fetchWithToken;

export function postWithToken(url, payload, options = {}) {
    options.method = 'POST';
    return fetchWithToken(url, payload, options);
}

export function getWithToken(url, options = {}) {
    options.method = 'GET';
    return fetchWithToken(url, null, options);
}