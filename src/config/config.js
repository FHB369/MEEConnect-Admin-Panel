import firebase from "firebase/app";

export const config = {
  apiKey: "AIzaSyCQybCYAGKRPd7Goky7DC1wcNn9nmqgdqQ",
  authDomain: "meeconnect-aebd2.firebaseapp.com",
  databaseURL: "https://meeconnect-aebd2.firebaseio.com",
  projectId: "meeconnect-aebd2",
  storageBucket: "meeconnect-aebd2.appspot.com",
  messagingSenderId: "19683615869",
  appId: "1:19683615869:web:0b4f677ebdbc3762"
};

const fire = firebase.initializeApp(config);

export default fire;
