// Token debugging utilities

export const debugTokens = () => {
  console.log('=== Token Debug Info ===');
  
  // Check cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  console.log('Browser cookies:', cookies);
  console.log('Access token present:', !!cookies['sb-access-token']);
  console.log('Refresh token present:', !!cookies['sb-refresh-token']);
  
  // Check localStorage for tokens
  const localStorageTokens = {
    'sb-access-token': localStorage.getItem('sb-access-token'),
    'sb-refresh-token': localStorage.getItem('sb-refresh-token'),
    'sb-token-expiry': localStorage.getItem('sb-token-expiry')
  };
  console.log('LocalStorage tokens:', localStorageTokens);
  
  // Check sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage).filter(key => 
    key.includes('supabase') || key.includes('auth') || key.includes('token')
  );
  console.log('SessionStorage auth keys:', sessionStorageKeys);
  
  // Check URL hash for tokens
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const hashTokens = {
    access_token: hashParams.get('access_token'),
    refresh_token: hashParams.get('refresh_token'),
    expires_in: hashParams.get('expires_in')
  };
  console.log('URL hash tokens:', hashTokens);
  
  console.log('=== End Token Debug ===');
  
  return {
    cookies,
    localStorage: localStorageKeys,
    sessionStorage: sessionStorageKeys,
    hashTokens
  };
};

export const setTokensFromHash = () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  
  if (accessToken) {
    console.log('Setting tokens from URL hash...');
    
    // Store tokens in localStorage (more reliable than cookies for cross-origin)
    localStorage.setItem('sb-access-token', accessToken);
    if (refreshToken) {
      localStorage.setItem('sb-refresh-token', refreshToken);
    }
    
    // Also set expiry
    const expiresIn = hashParams.get('expires_in') || '3600'; // Default 1 hour
    const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
    localStorage.setItem('sb-token-expiry', expiryTime.toString());
    
    console.log('Tokens stored in localStorage');
    
    // Trigger auth context refresh
    localStorage.setItem('oauth-tokens-updated', Date.now().toString());
    setTimeout(() => {
      localStorage.removeItem('oauth-tokens-updated');
    }, 1000);
    
    return { accessToken, refreshToken };
  }
  
  return null;
};

// Helper function to get stored token
export const getStoredToken = () => {
  const token = localStorage.getItem('sb-access-token');
  const expiry = localStorage.getItem('sb-token-expiry');
  
  if (!token) return null;
  
  // Check if token is expired
  if (expiry && Date.now() > parseInt(expiry)) {
    console.log('Token expired, clearing storage');
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('sb-refresh-token');
    localStorage.removeItem('sb-token-expiry');
    return null;
  }
  
  return token;
};

// Helper function to clear tokens
export const clearStoredTokens = () => {
  localStorage.removeItem('sb-access-token');
  localStorage.removeItem('sb-refresh-token');
  localStorage.removeItem('sb-token-expiry');
  console.log('Tokens cleared from localStorage');
};