import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getDatabase} from "firebase/database";

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

const getApp = function() {
    return initializeApp(firebaseConfig);
}
export function getFbAuth (app) {
    return getAuth(app);
}
export function getDb() {
    return getDatabase(getApp());
}
export async function getProfile() {
    try {
        const profile = JSON.parse(sessionStorage.getItem('user'));
        return profile;
    } catch (err) {
        console.log(err);
        return null;
    }
}
export function afterSceneLoads(caller, data) {
    const scene = document.querySelector('a-scene');
    if (scene && scene.hasLoaded) {
        caller(data);
    } else {
        document.addEventListener('aframeReady', (evt) => {
            caller(data);
        });
    }

}
