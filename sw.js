/* Quiet PWA service worker — offline app shell (v3) */
const CACHE='quiet-v3';
const ASSETS=['.','index.html','dark.html',
  'manifest-light.webmanifest','manifest-dark.webmanifest',
  'icon-light-192.png','icon-light-512.png','apple-touch-icon-light.png',
  'icon-dark-192.png','icon-dark-512.png','apple-touch-icon-dark.png','favicon-48.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.map(k=>k!==CACHE&&caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;

  // PAGE LOADS: always go to the network first so the exact URL (light OR dark)
  // is served fresh. Only fall back to the cache for THAT SAME page when offline —
  // never substitute the other theme.
  if(req.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const res=await fetch(req);
        try{ const u=new URL(req.url); if(u.origin===location.origin && res.ok){ const c=await caches.open(CACHE); c.put(req,res.clone()); } }catch(_){}
        return res;
      }catch(_){
        const same=await caches.match(req,{ignoreSearch:true});
        return same || Response.error();
      }
    })());
    return;
  }

  // STATIC ASSETS (icons, manifests): cache-first for speed/offline.
  e.respondWith((async()=>{
    const cached=await caches.match(req);
    if(cached) return cached;
    try{
      const res=await fetch(req);
      try{ const u=new URL(req.url); if(u.origin===location.origin && res.ok){ const c=await caches.open(CACHE); c.put(req,res.clone()); } }catch(_){}
      return res;
    }catch(_){ return Response.error(); }
  })());
});
