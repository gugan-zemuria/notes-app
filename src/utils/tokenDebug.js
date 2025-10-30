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
  
  // Check localStorage (in case tokens are stored there)
  const localStorageKeys = Object.keys(localStorage).filter(key => 
    key.includes('supabase') || key.includes('auth') || key.includes('token')
  );
  console.log('LocalStorage auth keys:', localStorageKeys);
  
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
    
    // Set cookies manually as fallback
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    
    document.cookie = `sb-access-token=${accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    if (refreshToken) {
      const refreshExpires = new Date();
      refreshExpires.setTime(refreshExpires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      document.cookie = `sb-refresh-token=${refreshToken}; expires=${refreshExpires.toUTCString()}; path=/; SameSite=Lax`;
    }
    
    console.log('Tokens set in cookies');
    return { accessToken, refreshToken };
  }
  
  return null;
};