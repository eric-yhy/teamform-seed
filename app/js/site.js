
//
// How to parse parameters from URL string
// Reference: http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
// Usage:
//   var myvar = getURLParameter('myvar');
//

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//
// This function is automatically generated by the Firebase web console
// Please change this function accordingly
// Reference: https://console.firebase.google.com 
//

function initalizeFirebase() {

  // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyDTXQFSuriwxpvJd0mZHElmLmhL8AIYmWE",
  //   authDomain: "teamform-15bcb.firebaseapp.com",
  //   databaseURL: "https://teamform-15bcb.firebaseio.com",
  //   storageBucket: "teamform-15bcb.appspot.com",
  // };
  //  the config above is peter's firebase'


  //our own firebase (owned under team account)
    var config = {
      apiKey: "AIzaSyCw7pPwTqi5mXO84LEfYOVUOI1_UPTTg94",
      authDomain: "teapot-576b6.firebaseapp.com",
      databaseURL: "https://teapot-576b6.firebaseio.com",
      storageBucket: "teapot-576b6.appspot.com",
      messagingSenderId: "955450264497"
    };
    firebase.initializeApp(config);

  // Vivian own firebase for testing
  // var config = {
  //   apiKey: "AIzaSyBZLwdkcSVTj5wU81C5lmztCYk7jcBsLfs",
  //   authDomain: "comp3111-418-teapot.firebaseapp.com",
  //   databaseURL: "https://comp3111-418-teapot.firebaseio.com",
  //   storageBucket: "comp3111-418-teapot.appspot.com",
  //   messagingSenderId: "144499913129"
  // };
  // firebase.initializeApp(config);

}

//
// User-defined function - Useful for retrieving an object once, without 3-way sync 
// For 3-way sync, use $firebaseObject or $firebaseArray provided by AngularFire
//

function retrieveOnceFirebase(firebase, refPath, callbackFunc) {
  firebase.database().ref(refPath).once("value").then(callbackFunc);
}

function scrollToTop() {
  $window.scrollTo(0, 0);
  console.log("scrollToTop");
}
