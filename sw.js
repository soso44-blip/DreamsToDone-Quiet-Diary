/* Quiet PWA service worker — offline app shell */
const CACHE='quiet-v1';
const ASSETS=['.','index.html','dark.html',
  'manifest-light.webmanifest','manifest-dark.webmanifest',
  'icon-light-192.png','icon-light-512.png','apple-touch-icon-light.png',
  'icon-dark-192.png','icon-dark-512.png','apple-touch-icon-dark.png','favicon-48.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k!==CACHE&&caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  e.respondWith((async()=>{
    const cached=await caches.match(req); if(cached) return cached;
    try{
      const res=await fetch(req);
      try{const u=new URL(req.url); if(u.origin===location.origin && res.ok){const c=await caches.open(CACHE); c.put(req,res.clone());}}catch(_){}
      return res;
    }catch(_){ return (await caches.match('index.html')) || Response.error(); }
  })());
});