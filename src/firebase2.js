import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB_P8b8ZItk8oJxx6SJxgQAOMFEKkfYb-0",
    authDomain: "insta-clone-20469.firebaseapp.com",
    projectId: "insta-clone-20469",
    storageBucket: "insta-clone-20469.appspot.com",
    messagingSenderId: "29285125301",
    appId: "1:29285125301:web:a1ad7e58f1fad6de4542fc",
    measurementId: "G-M8KVQHTYQ3"
};

let app;

if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}
const db = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
