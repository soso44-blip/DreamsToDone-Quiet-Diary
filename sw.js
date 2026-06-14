/* Quiet PWA service worker — offline app shell (v4).
   Pages are served NETWORK-FIRST so the exact URL (light index.html OR dark.html)
   always loads correctly when online. Offline, each page falls back ONLY to its
   own cached copy — it never substitutes the other theme. Static assets are
   cache-first so the app still works fully offline. */
const CACHE='quiet-v4';
const ASSETS=['.','index.html','dark.html',
  'manifest-light.webmanifest','manifest-dark.webmanifest',
  'icon-light-192.png','icon-light-512.png','apple-touch-icon-light.png',
  'icon-dark-192.png','icon-dark-512.png','apple-touch-icon-dark.png','favicon-48.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req=e.request;
  if(req.method!=='GET') return;

  if(req.mode==='navigate'){
    e.respondWith((async function(){
      try{
        var res=await fetch(req);                       // online: always the real, exact URL
        try{ var u=new URL(req.url); if(u.origin===location.origin && res.ok){ var c=await caches.open(CACHE); c.put(req,res.clone()); } }catch(_){}
        return res;
      }catch(_){
        var same=await caches.match(req,{ignoreSearch:true});  // offline: ONLY this same page
        return same || Response.error();                       // never serve the other theme
      }
    })());
    return;
  }

  e.respondWith((async function(){
    var cached=await caches.match(req); if(cached) return cached;
    try{
      var res=await fetch(req);
      try{ var u=new URL(req.url); if(u.origin===location.origin && res.ok){ var c=await caches.open(CACHE); c.put(req,res.clone()); } }catch(_){}
      return res;
    }catch(_){ return Response.error(); }
  })());
});
