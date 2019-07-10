var url = window.location.href;
var swLocation = '/venta-cerveza-ocoyoacac/sw.js';
const messaging = firebase.messaging();

if (navigator.serviceWorker) {

  if (url.includes('localhost')) {

    swLocation = '/sw.js';

  }

  // window.addEventListener('load', () => {

  navigator.serviceWorker.register(swLocation).then(registration => {
    console.log('registrado')
    messaging.useServiceWorker(registration);


    // Add the public key generated from the console here.
    messaging.usePublicVapidKey("BP-2K1ewpmeAkqn6RtX9vkb1zFlbNwbOjOT_5dHGBg5UzTZKi-zuw_mXQKjXqse6XRnUv4-RRy-3fmnFHxVa6ng");

    messaging.requestPermission().then(function () {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
    }).catch(function (err) {
      console.log('Unable to get permission to notify.', err);
    });


    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then(function (currentToken) {
      console.log(currentToken)
      if (currentToken) {
        //   sendTokenToServer(currentToken);
        //   updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        //   updateUIForPushPermissionRequired();
        //   setTokenSentToServer(false);
      }
    }).catch(function (err) {
      console.log('An error occurred while retrieving token. ', err);
      // showToken('Error retrieving Instance ID token. ', err);
      // setTokenSentToServer(false);
    });


  });

  // });

}

