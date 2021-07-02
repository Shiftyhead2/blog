import firebase from 'firebase/app';
import "firebase/firestore";


var firebaseConfig = {
  apiKey: "AIzaSyBum7z5FGDryW9q5o8x8ayMd_5P57nks_0",
  authDomain: "personalblog-60d5b.firebaseapp.com",
  projectId: "personalblog-60d5b",
  storageBucket: "personalblog-60d5b.appspot.com",
  messagingSenderId: "233596587236",
  appId: "1:233596587236:web:b54fb0766dc051b9e870f1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {timestamp};
export default firebaseApp.firestore();