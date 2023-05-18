var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-final-1';
var filesToCache = [
  'WEATHER_APP/',
  'WEATHER_APP/index.html',
  'WEATHER_APP/app.js',
  'WEATHER_APP/styles/inline.css',
  'WEATHER_APP/images/clear.png',
  'WEATHER_APP/images/cloudy-scattered-showers.png',
  'WEATHER_APP/images/cloudy.png',
  'WEATHER_APP/images/fog.png',
  'WEATHER_APP/images/ic_add_white_24px.svg',
  'WEATHER_APP/images/ic_refresh_white_24px.svg',
  'WEATHER_APP/images/partly-cloudy.png',
  'WEATHER_APP/images/rain.png',
  'WEATHER_APP/images/scattered-showers.png',
  'WEATHER_APP/images/sleet.png',
  'WEATHER_APP/images/snow.png',
  'WEATHER_APP/images/thunderstorm.png',
  'WEATHER_APP/images/wind.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  /*var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }*/
});
