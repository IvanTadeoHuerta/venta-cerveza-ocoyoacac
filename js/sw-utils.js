//Guarda el cache dinamico

function actualizaCacheDinamico(dynamicCache, req, res){

    //SI LA RESPUESTA ES CORRECTA
    if( res.ok ) {

        //ABRE LA CACHE Y SE AGREGA A LA CACHE DINAMICA
        return caches.open( dynamicCache ).then( cache =>{
            // console.log('req', req)
            cache.put( req, res.clone() );
            limpiarCache( dynamicCache, 9);

            return res.clone();

        });

    } else {

        //SI NO ES EXITOSA LA RESPUESTA, REGRESA EL ERROR
        return res;

    }

}


//LIMITAR LA CACHE
function limpiarCache(cacheName, numeroItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys().then(key => {
              
                if (key.length > numeroItems) {
                    
                    cache.delete(key[0])
                        .then(limpiarCache(cacheName, numeroItems));
                }
            })
        });
}

//MANEJO DE MENSAJES. API CAHCHE NO SOPORTA POST
function manejoApiMensajes( req ) {
    return req.clone().method === 'POST';
}