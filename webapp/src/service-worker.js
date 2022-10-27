// service worker full tutorial serieshttps://www.youtube.com/watch?v=ChXgikdQJR8
const staticCache = 'static-assets-v3'
const staticAssets = [
    '/',
    '/index.html',
    '/src/caffe-cart-item.component.js',
    '/src/caffe-cart.component.js',
    '/src/caffe-menu-item.component.js',
    '/src/caffe-menu.component.js',
    '/src/caffe-order-history-item.component.js',
    '/src/caffe-order-history.component.js',
    '/src/caffe-order-history.component.js',
    '/src/order.class.js',
    '/src/tools.js',
    '/css/main.css',
    '/css/normalize.css',
    '/css/theme.css',
    '/assets/SVG',
    '/assets/avocado-toast.png',
    '/assets/AWSOME.png',
    '/assets/capuccino.png',
    '/assets/croissant.png',
    '/assets/cup-coffee.png',
    '/assets/hot-chocolate.png',
]

self.addEventListener("install", (event) => {
    // console.log('on install')
    event.waitUntil(
        caches.open(staticCache)
            .then(cache => cache.addAll(staticAssets))
            .then(() => console.log('caching static assets'))
            .catch(console.error)
    )
})



self.addEventListener("activate", (event) => {
    console.log('on activate')
    event.waitUntil(
        caches.keys().then(keys => Promise
            .all(keys
                .filter(key => key !== staticCache)
                .map(key => caches.delete(key))))
    )
})


self.addEventListener("fetch", (event) => {
    // console.log('on fetch', event)
    event.respondWith(
        caches.match(event.request)
            .then(cacheRes => cacheRes || fetch(event.request))
        )


})


