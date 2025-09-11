import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase (valores de exemplo - devem ser substituídos pelos reais)
const firebaseConfig = {
  apiKey: "AIzaSyExample-API-Key-Replace-With-Real",
  authDomain: "cambio-site-example.firebaseapp.com",
  projectId: "cambio-site-example",
  storageBucket: "cambio-site-example.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

