
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { APIKEY } from "../.env";

const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: "grievance-4ae11.firebaseapp.com",
    projectId: "grievance-4ae11",
    storageBucket: "grievance-4ae11.firebasestorage.app",
    messagingSenderId: "877094895908",
    appId: "1:877094895908:web:c8d0a22eaf3900aaebf3b1",
    measurementId: "G-FY9QVYH7XN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, app, analytics };
