import profile from "/api/user/profile" assert {type: 'json'};
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyAEkQdc91Hnjek1v-KlXiYLf5fHN_pKB_E",
  authDomain: "metastore-37b60.firebaseapp.com",
  databaseURL: "https://metastore-37b60-default-rtdb.firebaseio.com",
  projectId: "metastore-37b60",
  storageBucket: "metastore-37b60.appspot.com",
  messagingSenderId: "312692319255",
  appId: "1:312692319255:web:6aa206a92440a771a42852",
  measurementId: "G-26SWC62X80"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();
signInWithCustomToken(auth, profile.firebase_token).then((credential) => {

});

const database = getDatabase(app);

export function writeUser(user) {
  user.last_seen = new Date().toUTCString();
  set(ref(database, 'users/' + user.sub), user);
}
export function writeUniverse() {
  const scene = document.querySelector('#scene');
  set(ref(database, 'universes/1'), scene);
}
const users = ref(database, 'users/' + profile.sub);
onValue(users, (snapshot) => {
  const data = snapshot.val();
})
writeUser(profile);
