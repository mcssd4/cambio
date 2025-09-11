import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { db, auth, storage } from './firebase';

// Serviços de Autenticação
export const authService = {
  // Registrar usuário
  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Serviços de Upload
export const uploadService = {
  // Upload de arquivo
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Serviços de Usuário
export const userService = {
  // Criar registro de usuário
  async createUserRegistration(userData) {
    try {
      const docRef = await addDoc(collection(db, 'userRegistrations'), {
        ...userData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Buscar registros pendentes
  async getPendingRegistrations() {
    try {
      const q = query(
        collection(db, 'userRegistrations'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const registrations = [];
      querySnapshot.forEach((doc) => {
        registrations.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: registrations };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Aprovar/Rejeitar registro
  async updateRegistrationStatus(registrationId, status, notes = '') {
    try {
      const docRef = doc(db, 'userRegistrations', registrationId);
      await updateDoc(docRef, {
        status,
        notes,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Serviços de Transação
export const transactionService = {
  // Criar transação
  async createTransaction(transactionData) {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Buscar transações pendentes
  async getPendingTransactions() {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Atualizar status da transação
  async updateTransactionStatus(transactionId, status, paymentInfo = null) {
    try {
      const updateData = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (paymentInfo) {
        updateData.paymentInfo = paymentInfo;
      }

      const docRef = doc(db, 'transactions', transactionId);
      await updateDoc(docRef, updateData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Buscar transação por ID
  async getTransactionById(transactionId) {
    try {
      const docRef = doc(db, 'transactions', transactionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Transação não encontrada' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

