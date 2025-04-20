// Usa tu propia config de Paraya aquí
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBktlJ-gt6Q-1BVQJHZUjuuDTefP9Q1PmY",
  authDomain: "paraya-49f0c.firebaseapp.com",
  projectId: "paraya-49f0c",
  storageBucket: "paraya-49f0c.firebasestorage.app",
  messagingSenderId: "456105237525",
  appId: "1:456105237525:web:2d401db9624dd98640821c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
