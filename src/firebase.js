import { initializeApp }
from "firebase/app";

import {
  getDatabase
}
from "firebase/database";

const firebaseConfig = {

  apiKey: "AIzaSyChMW6AbPZw_5v77tMpuWE8lqSexFuHQAM",

  authDomain:
  "crime-55c96.firebaseapp.com",

  databaseURL:
   "https://crime-55c96-default-rtdb.asia-southeast1.firebasedatabase.app",

   projectId:
  "crime-55c96",

  storageBucket:
  "crime-55c96.firebasestorage.app",

  messagingSenderId:
 "859309839565",

  appId:
 "1:859309839565:web:89e5b861c07de32909c584",
};

const app =
initializeApp(firebaseConfig);

export const db =
getDatabase(app);