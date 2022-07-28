import profile from "/api/user/profile" assert {type: 'json'};
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import { getDatabase, get, ref, set, onChildRemoved, child, onValue } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";


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
export function writeUniverse(universe) {
  set(ref(database, 'universes/' + universe.id), universe);
}
const users = ref(database, 'users/' + profile.sub);
onValue(users, (snapshot) => {
  const data = snapshot.val();
})

const universes = ref(database, 'universes');
onValue(universes, (snapshot) => {
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
onChildRemoved(universes, (snapshot) => {
  const ele = document.querySelector('#'+snapshot.val().id);
  if (ele) {
    ele.parentNode.removeChild(ele);
  }

});

function removeUniverse(id) {
  const obj = document.querySelector(id);
}
writeUser(profile);

export function createUniverse(id, pos, text) {
  const scene = document.querySelector('a-scene');
  const ele = document.createElement('a-entity');

  ele.setAttribute('template', 'src: #universe');
  ele.setAttribute('position', pos);

  scene.appendChild(ele);
  //stupid hack I don't 100% understand why I need to do this...seems like async load is problem.
  window.setTimeout(function() {
    ele.setAttribute('universe', 'text: ' + text);
    const uuid = id? id: createUUID();
    ele.parentEl.setAttribute('id', uuid);

    const data = {
      id: uuid,
        text: text,
        position: pos,
        template: '#universe'}
      writeUniverse(data);
  },200);
}
