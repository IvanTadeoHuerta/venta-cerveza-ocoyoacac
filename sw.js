
importScripts('js/sw-utils.js');

const NAME_STATIC_CACHE = 'static-v1';
const NAME_DINAMYC_CACHE = 'dinamyc-v1';
const NAME_INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    'index.html',
    'css/main.css',
    'img/fav.png',
    'img/footer-bg.png',
    'img/header-bg-movil-corona.jpg',
    'img/header-bg-movil-tecate.jpg',
    'img/header-bg-movil-vic.jpg',
    'img/header-bg.png',
    'img/logo.png',
    'img/menu-bg.jpg',
    'img/pagas.png',
    'img/pides.png',
    'img/productos.jpg',
    'img/recibes.png',
    'js/sw-utils.js',
    'js/main.js',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'css/bootstrap.css',
    'css/font-awesome.min.css',
    'css/linearicons.css',
    'js/vendor/bootstrap.min.js',
    'js/vendor/easing.min.js',
    'js/vendor/jquery-2.2.4.min.js',
    'js/vendor/superfish.min.js',
    'https://fonts.googleapis.com/css?family=Poppins:100,200,400,300,500,600,700'
]

self.addEventListener('install', event => {

    const saveCacheStatic = caches.open(NAME_STATIC_CACHE).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const saveCacheInmutable = caches.open(NAME_INMUTABLE_CACHE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    event.waitUntil(Promise.all([saveCacheStatic, saveCacheInmutable]));


});

//Proceso para borrar cache cuando se hacen cambios en el SW
self.addEventListener('activate', event => {
    console.log('sw activado')
    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== NAME_STATIC_CACHE && key.includes('static')) {
                // console.log(key,NAME_STATIC_CACHE )
                return caches.delete(key);
            }
        });

    });

    event.waitUntil(respuesta);

    

});

//CACHE CON NETWORK FALLBACK, PRIMERO CONSULTA CACHE SI NO ENCUENTRA EN LA CACHE VE A LA WEB
// EL CACHE DINAMICO SE CREA CUANDO NO SE ENCUENTRA UN ARCHIVO EN EL CACHE
self.addEventListener('fetch', event => {

    //CONSULTA EL CACHE 
    const respuesta = caches.match(event.request).then(resp => {

        //SI EXISTE REQUEST EN CACHE , REGRESA EL ARCHIVO
        if (resp) {

            return resp;

        } else {

            //SI NO EXISTE VA A INTERNET
            return fetch(event.request).then(newResponse => {

                return actualizaCacheDinamico(NAME_DINAMYC_CACHE, event.request, newResponse);

            });
        }
    });

    event.respondWith(respuesta);

});