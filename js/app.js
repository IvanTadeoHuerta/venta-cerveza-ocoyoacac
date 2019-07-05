var url = window.location.href;
var swLocation = '/venta-cerveza-ocoyoacac/sw.js';

if( navigator.serviceWorker ){

    if( url.includes('localhost') ){

        swLocation = '/sw.js';
        
    }

    navigator.serviceWorker.register(swLocation);

}