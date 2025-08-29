import { useEffect } from 'react';

export const useAutoVersionCheck = () => {
  const currentCommitHash = __GIT_COMMIT_HASH__;

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // 현재 배포된 index.html을 캐시 없이 가져오기
        const response = await fetch(window.location.href, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const html = await response.text();
        
        // HTML에서 현재 배포된 JS 파일의 해시를 추출
        const scriptMatch = html.match(/assets\/index-([^.]+)\.js/);
        const deployedHash = scriptMatch?.[1];
        
        // 현재 로드된 스크립트 태그의 해시 추출
        const loadedScript = document.querySelector('script[src*="assets/index-"]');
        const loadedHash = loadedScript?.getAttribute('src')?.match(/assets\/index-([^.]+)\.js/)?.[1];
        
        // 해시가 다르면 새 버전이 배포됨
        if (deployedHash && loadedHash && deployedHash !== loadedHash) {
          console.log('새 버전 감지됨. 캐시를 무효화하고 페이지를 새로고침합니다...');
          
          // 캐시 무효화
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
          }
          
          // 즉시 새로고침
          window.location.reload();
        }
      } catch (error) {
        console.log('버전 체크 실패:', error);
      }
    };

    // 페이지 로드 시 한 번만 체크
    checkVersion();
  }, [currentCommitHash]);
};
