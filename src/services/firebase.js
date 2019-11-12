import firebase from 'firebase/app'
import 'firebase/storage'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCcIoyb-Gs3wZrFvViWeMMWD8DYpGqTPpY",
    authDomain: "amgweb.firebaseapp.com",
    databaseURL: "https://amgweb.firebaseio.com",
    projectId: "amgweb",
    storageBucket: "amgweb.appspot.com",
    messagingSenderId: "937480900452",
    appId: "1:937480900452:web:b3eecf30096cf8a332f471"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase 
