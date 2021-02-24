import firebase from "firebase/app";
const firebaseConfig={
     apiKey: "AIzaSyDQ963Z8pwBfmt5qX2C8snTIJdbdbf552E",
    authDomain: "city-map-b70af.firebaseapp.com",
    projectId: "city-map-b70af",
    storageBucket: "city-map-b70af.appspot.com",
    messagingSenderId: "532077810892",
    appId: "1:532077810892:web:d53aadf007de7ea9db9e69"
}

export const firebaseApp= firebase.initializeApp(firebaseConfig);