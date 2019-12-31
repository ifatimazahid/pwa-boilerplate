// Shell resources have that static data that remains even when the broswer goes offline.
const staticCacheName = 'site-static-v4'; //app shell assets
const dynamicCache = 'site-dynamic-v4'; 
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.jpg',
    '/img/pizza.jpg',
    '/img/soup.jpg',
    '/img/spaghetti.jpg',
    '/img/turkey.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];

//Limit the size of cache (calling this fn in fetch event)
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
};

// Add an event that listens to the SW being installed

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
      caches.open(staticCacheName).then((cache) => {
        console.log('caching shell assets');
        cache.addAll(assets);
      })
    );
  });

// Listen to SW being activated
self.addEventListener('activate', evt => {
   // console.log('Service worker activated');
   evt.waitUntil(
       caches.keys().then(keys => {
          // console.log(keys); //displays the name of all versions of caches
          return Promise.all(keys
            .filter(key => key !== staticCacheName && key !== dynamicCache)

            //deleting a cache i.e no longer in use.
            .map(key =>caches.delete(key))
            )
       })
   );

});

//After changes, a SW will reactivate when all instances of browser tabs are closed (or the APP is closed then reopened in a mobile).
//There are criterias to be met when wanting to apply "Add to Home screen" button on your App. For Example, have a manifest.json file, user should be active for more than 30s etc.
//Lighthouse Audit is where you can judge your website according to PWA standards.

// Listen to SW fetching data (once from the server in the beginning & rest of the time from the cache)
self.addEventListener('fetch', evt => {

    //check if sth is in the cache & pass that to the respond event.
//    console.log('Data Fetched', evt);

if(evt.request.url.indexOf('firestore.googleapis.com') === -1)
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {

            //if resource is not in cache then fetch it from server
            return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone()); //makes a clone of the response
                        limitCacheSize(dynamicCache, 15);
                        return fetchRes;
                    })
                });
        }).catch(() => {

            //return an html page in case of being offline 
            if(evt.request.url.indexOf('.html') > -1){
                return caches.match('/pages/fallback.html')
            }
        })
    );
});