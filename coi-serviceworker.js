/* coi-serviceworker v0.1.7 - https://github.com/gzuidhof/coi-serviceworker */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
function crossOriginIsolated(headers){
  return headers.get("cross-origin-embedder-policy")==="require-corp"&&
         headers.get("cross-origin-opener-policy")==="same-origin";
}
self.addEventListener("fetch",function(e){
  if(e.request.cache==="only-if-cached"&&e.request.mode!=="same-origin")return;
  e.respondWith(
    fetch(e.request).then(function(r){
      if(crossOriginIsolated(r.headers))return r;
      const newHeaders=new Headers(r.headers);
      newHeaders.set("Cross-Origin-Embedder-Policy","require-corp");
      newHeaders.set("Cross-Origin-Opener-Policy","same-origin");
      return new Response(r.body,{status:r.status,statusText:r.statusText,headers:newHeaders});
    })
  );
});
