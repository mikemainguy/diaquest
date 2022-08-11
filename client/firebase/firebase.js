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

export function writeEntity(data) {
  set(ref(database, 'entities/' + data.id), data);
}
export function removeEntity(id) {
  remove(ref(database, 'entities/' + id));
}
const users = ref(database, 'users/' + profile.sub);
onValue(users, (snapshot) => {
  const data = snapshot.val();
})

/*const entities = ref(database, 'entities/');
get(entities).then( (snapshot) => {
  snapshot.forEach((item) => {
    console.log('existing data ' + item.val().id);
    createEntity(item.val());
  });
}) */
function createEntity(entity) {
  if (document.querySelector('#'+entity.id)) {
    console.log(entity.id + ' already exists');
  } else {
    switch (entity.template) {
      case '#universe':
        createUniverse(entity.id, entity.position, entity.text);
        break;
      case '#connector':
        createConnector(entity.id, entity.first, entity.second);
        break;
    }
  }
}
const entities2 = ref(database, 'entities');
onChildAdded(entities2, (snapshot) => {
  console.log('child added ' + snapshot.val().id);
  createEntity(snapshot.val());

});
onChildRemoved(entities2, (snapshot) => {
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


function createConnector(id, first, second) {
  const scene = document.querySelector("a-scene");
  const ele = document.createElement('a-entity');
  ele.setAttribute('id', id);
  ele.setAttribute('template', 'src: #connector-template');
  window.setTimeout(function() {
    ele.setAttribute('connector', 'startEl: #' + first + "; endEl: #" + second);
  }, 200)

  scene.appendChild(ele);
}
