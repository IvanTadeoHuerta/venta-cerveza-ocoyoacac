var url = window.location.href;
var swLocation = '/venta-cerveza-ocoyoacac/sw.js';
var urlHttpService = 'http://localhost:8081';
var swReg;
const messaging = firebase.messaging();


if (navigator.serviceWorker) {

  if (url.includes('localhost')) {

    swLocation = '/sw.js';

  }

  // window.addEventListener('load', () => {

  navigator.serviceWorker.register(swLocation).then(registration => {

    swReg = registration;

    messaging.useServiceWorker(registration);

    // Add the public key generated from the console here.
    //messaging.usePublicVapidKey("BNGaScfjSCF6Z-rvCqYttWnIVuLBndS68PrnvUWHB-fPogh4_EKh5nQ0292tjIEn-PbvsQZItru9WgwwAp-EVhY");

    swReg.pushManager.getSubscription().then(verificaSuscripcion);



    // messaging.requestPermission().then(function () {
    //   console.log('Notification permission granted.');
    //   // TODO(developer): Retrieve an Instance ID token for use with FCM.
    //   // ...
    // }).catch(function (err) {
    //   //console.log('Unable to get permission to notify.', err);
    // });


    // // Get Instance ID token. Initially this makes a network call, once retrieved
    // // subsequent calls to getToken will return from cache.
    // messaging.getToken().then(function (currentToken) {
    //   console.log(currentToken)
    //   if (currentToken) {
    //     //   sendTokenToServer(currentToken);
    //     //   updateUIForPushEnabled(currentToken);
    //   } else {
    //     // Show permission request.
    //     console.log('No Instance ID token available. Request permission to generate one.');
    //     // Show permission UI.
    //     //   updateUIForPushPermissionRequired();
    //     //   setTokenSentToServer(false);
    //   }
    // }).catch(function (err) {
    //   //console.log('An error occurred while retrieving token. ', err);
    //   // showToken('Error retrieving Instance ID token. ', err);
    //   // setTokenSentToServer(false);
    // });


  });

  // });

  // Referencias de jquery

  var btnActivaNoti = $('.btn-activar-noti');
  var btnDesNoti = $('.btn-desactiva-noti');


  // Notificaciones
  function verificaSuscripcion(activadas) {

    if (!activadas) {

      btnActivaNoti.removeClass('oculto');
      btnDesNoti.addClass('oculto');

    } else {
      btnActivaNoti.addClass('oculto');
      btnDesNoti.removeClass('oculto');
    }

  }


  function notifyMe() {
    // Comprobamos si el navegador soporta las notificaciones
    if (!("Notification" in window)) {
      alert("Este navegador no soporta las notificaciones del sistema");
    }

    // Comprobamos si ya nos habían dado permiso
    else if (Notification.permission === "granted") {
      // Si esta correcto lanzamos la notificación
      getToken();
    }

    // Si no, tendremos que pedir permiso al usuario
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // Si el usuario acepta, lanzamos la notificación
        if (permission === "granted") {

          getToken();

        }
      });
    }

    // Finalmente, si el usuario te ha denegado el permiso y 
    // quieres ser respetuoso no hay necesidad molestar más.
  }

  function getToken() {

    messaging.getToken().then(function (currentToken) {
      if (currentToken) {
        suscripcionOfertas(currentToken);
      } else {
        console.log('No Instance ID token available. Request permission to generate one.');
      }
    }).catch(function (err) { });

  }

  function suscripcionOfertas(tokenDivice) {

    let suscripcion = { "topic_id": 1, "topic": "ofertas", "deviceTokens": [tokenDivice] };

    fetch(`${urlHttpService}/api/Notifications/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(suscripcion)
    }).then(response => {
      if (response.status == 200) {
        swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array("BNGaScfjSCF6Z-rvCqYttWnIVuLBndS68PrnvUWHB-fPogh4_EKh5nQ0292tjIEn-PbvsQZItru9WgwwAp-EVhY")
        });

        verificaSuscripcion(true);

      }
      return response.text();
    }).then(console.log)
      .catch(console.log);

  }

  function cancelarSuscripcion() {

    swReg.pushManager.getSubscription().then(subs => {

      subs.unsubscribe().then(() => verificaSuscripcion(false));

    });

  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }



  btnActivaNoti.on('click', function () {
    notifyMe();
  });


  btnDesNoti.on('click', function () {

    cancelarSuscripcion();

  });

}

