import profile from "/api/user/profile" assert {type: 'json'};
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import { getDatabase, remove, ref, set, onChildRemoved, onChildAdded, get, onValue } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";


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
export function writeUniverse(uid, pos, text) {
  const data = {
    id: uid,
    position: pos,
    text: text,
    template: "#universe"
  }
  set(ref(database, 'universes/' + uid), data);
}
export function removeUniverse(id) {
  remove(ref(database, 'universes/' + id));
}
const users = ref(database, 'users/' + profile.sub);
onValue(users, (snapshot) => {
  const data = snapshot.val();
})

const universes = ref(database, 'universes/');
get(universes).then( (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  snapshot.forEach((item) => {
    const it = item.val()
    if (document.querySelector('#'+it.id)) {
      console.log(it.id + ' already exists');
    } else {
      createUniverse(it.id, it.position, it.text);
    }
  });
})
const universes2 = ref(database, 'universes');
onChildAdded(universes2, (snapshot) => {
  const universe = snapshot.val();
  createUniverse(universe.id, universe.position, universe.text);
});
onChildRemoved(universes2, (snapshot) => {
  const ele = document.querySelector('#'+snapshot.val().id);
  if (ele) {
     ele.remove();

  }

});

writeUser(profile);

export function createUniverse(id, pos, text) {
  const scene = document.querySelector('a-scene');
  const ele = document.createElement('a-entity');

  ele.setAttribute('template', 'src: #universe');
  ele.setAttribute('position', pos);
  ele.setAttribute('id', id);
  window.setTimeout(function() {
    ele.setAttribute('universe', 'text: ' + text);
  }, 200);

  scene.appendChild(ele);
}
