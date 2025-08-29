import { useEffect } from 'react';

export const useAutoVersionCheck = () => {
  const currentCommitHash = __GIT_COMMIT_HASH__;

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Fetch the current deployed index.html without cache
        const response = await fetch(window.location.href, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });

        const html = await response.text();

        // Extract the hash of the currently deployed JS file from HTML
        const scriptMatch = html.match(/assets\/index-([^.]+)\.js/);
        const deployedHash = scriptMatch?.[1];

        // Extract the hash of the currently loaded script tag
        const loadedScript = document.querySelector('script[src*="assets/index-"]');
        const loadedHash = loadedScript?.getAttribute('src')?.match(/assets\/index-([^.]+)\.js/)?.[1];

        // If hashes are different, a new version has been deployed
        if (deployedHash && loadedHash && deployedHash !== loadedHash) {
          console.log('New version detected. Clearing cache and reloading page...');

          // Clear cache
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
          }

          // Reload immediately
          window.location.reload();
        }
      } catch (error) {
        console.log('Version check failed:', error);
      }
    };

    // Check version only once when page loads
    checkVersion();
  }, [currentCommitHash]);
};
