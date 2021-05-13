import firebase from 'firebase';

const firebaseConfig = {
/*
Get your own
 */
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
