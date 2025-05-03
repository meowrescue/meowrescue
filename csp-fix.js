// Fix CSP issues for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = `default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; 
                  script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; 
                  style-src 'self' 'unsafe-inline' data: blob:; 
                  img-src 'self' data: blob: https:; 
                  connect-src 'self' https:;`;
  document.head.appendChild(meta);
}
