// Session management utilities

export const SessionManager = {
  // Check if session is about to expire (within 24 hours)
  isSessionExpiringSoon: (session: { expires?: string }): boolean => {
    if (!session?.expires) return false;
    const expiryTime = new Date(session.expires).getTime();
    const now = Date.now();
    const hoursUntilExpiry = (expiryTime - now) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 24;
  },

  // Get remaining session time in human-readable format
  getSessionTimeRemaining: (session: { expires?: string }): string => {
    if (!session?.expires) return 'Unknown';
    const expiryTime = new Date(session.expires).getTime();
    const now = Date.now();
    const msRemaining = expiryTime - now;
    
    if (msRemaining <= 0) return 'Expired';
    
    const days = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours`;
    return `${hours} hours`;
  },

  // Check if we're in incognito/private mode
  isIncognitoMode: (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(({ quota }) => {
          resolve(quota! < 120000000); // Less than ~120MB suggests incognito
        });
      } else {
        resolve(false);
      }
    });
  },

  // Add event listeners for session management
  setupSessionHandlers: () => {
    // Listen for storage events (when user clears cookies in another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === null || e.key.includes('next-auth')) {
        console.log('Session cookies may have been cleared');
        window.location.reload();
      }
    });

    // Listen for beforeunload (browser closing)
    window.addEventListener('beforeunload', async () => {
      const isIncognito = await SessionManager.isIncognitoMode();
      if (isIncognito) {
        console.log('Browser closing in incognito mode - session will be deleted');
      }
    });

    // Listen for focus events (when user comes back to tab)
    window.addEventListener('focus', () => {
      // Check if session is still valid when user returns
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(session => {
          if (!session.user) {
            console.log('Session expired while away');
            window.location.href = '/auth/signin';
          }
        })
        .catch(() => {
          console.log('Session validation failed');
        });
    });
  }
};

export default SessionManager;