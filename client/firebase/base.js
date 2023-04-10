import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD4jJCYcIvHDEiOkVxC2c4zNYRqZKYHMMk",
    authDomain: "immersive-idea.firebaseapp.com",
    databaseURL: "https://immersive-idea-default-rtdb.firebaseio.com",
    projectId: "immersive-idea",
    storageBucket: "immersive-idea.appspot.com",
    messagingSenderId: "831017515098",
    appId: "1:831017515098:web:91b0dd4ae2f0a577184063",
    measurementId: "G-VCC438TT47"
};

const getApp = function () {
    return initializeApp(firebaseConfig);
}

export function getFbAuth(app) {
    return getAuth(app);
}

export function getDb() {
    return getDatabase(getApp());
}

export async function getProfile() {
    try {
        return JSON.parse(sessionStorage.getItem('user'));
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
        document.addEventListener('aframeLoaded', () => {
            console.log("Scene Listener Fired");
            caller(data);
        });
    }
}