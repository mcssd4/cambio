// CambioMax Pro - Firebase Integration Module

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "cambiomax-pro.firebaseapp.com",
    projectId: "cambiomax-pro",
    storageBucket: "cambiomax-pro.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678"
};

class FirebaseManager {
    constructor() {
        this.app = null;
        this.auth = null;
        this.firestore = null;
        this.storage = null;
        this.analytics = null;
        this.isInitialized = false;
        this.isConfigured = false;
        this.init();
    }
    
    async init() {
        try {
            // Check if Firebase is configured
            if (this.isFirebaseConfigured()) {
                await this.initializeFirebase();
            } else {
                console.warn('Firebase not configured. Using mock implementation.');
                this.initializeMockFirebase();
            }
            
            this.isInitialized = true;
            console.log('✅ Firebase Manager initialized');
        } catch (error) {
            console.error('Failed to initialize Firebase:', error);
            this.initializeMockFirebase();
        }
    }
    
    isFirebaseConfigured() {
        return firebaseConfig.apiKey !== "your-api-key-here" && 
               firebaseConfig.projectId !== "cambiomax-pro";
    }
    
    async initializeFirebase() {
        // In a real implementation, you would import Firebase SDK
        // import { initializeApp } from 'firebase/app';
        // import { getAuth } from 'firebase/auth';
        // import { getFirestore } from 'firebase/firestore';
        // import { getStorage } from 'firebase/storage';
        // import { getAnalytics } from 'firebase/analytics';
        
        // this.app = initializeApp(firebaseConfig);
        // this.auth = getAuth(this.app);
        // this.firestore = getFirestore(this.app);
        // this.storage = getStorage(this.app);
        // this.analytics = getAnalytics(this.app);
        
        this.isConfigured = true;
        console.log('Firebase initialized with real configuration');
    }
    
    initializeMockFirebase() {
        // Mock Firebase implementation for development/demo
        this.app = { name: 'mock-firebase' };
        this.auth = new MockAuth();
        this.firestore = new MockFirestore();
        this.storage = new MockStorage();
        this.analytics = new MockAnalytics();
        
        console.log('Firebase initialized with mock implementation');
    }
    
    // Authentication methods
    async signUp(email, password, userData = {}) {
        try {
            if (this.isConfigured) {
                // Real Firebase implementation
                // const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
                // await this.createUserProfile(userCredential.user.uid, userData);
                // return userCredential.user;
            } else {
                // Mock implementation
                return await this.auth.signUp(email, password, userData);
            }
        } catch (error) {
            console.error('Sign up error:', error);
            throw this.handleAuthError(error);
        }
    }
    
    async signIn(email, password) {
        try {
            if (this.isConfigured) {
                // Real Firebase implementation
                // const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
                // return userCredential.user;
            } else {
                // Mock implementation
                return await this.auth.signIn(email, password);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            throw this.handleAuthError(error);
        }
    }
    
    async signOut() {
        try {
            if (this.isConfigured) {
                // await signOut(this.auth);
            } else {
                await this.auth.signOut();
            }
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    }
    
    async resetPassword(email) {
        try {
            if (this.isConfigured) {
                // await sendPasswordResetEmail(this.auth, email);
            } else {
                await this.auth.resetPassword(email);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            throw this.handleAuthError(error);
        }
    }
    
    getCurrentUser() {
        if (this.isConfigured) {
            // return this.auth.currentUser;
        } else {
            return this.auth.getCurrentUser();
        }
    }
    
    onAuthStateChanged(callback) {
        if (this.isConfigured) {
            // return onAuthStateChanged(this.auth, callback);
        } else {
            return this.auth.onAuthStateChanged(callback);
        }
    }
    
    // Firestore methods
    async createUserProfile(userId, userData) {
        try {
            const profileData = {
                ...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'pending_verification'
            };
            
            if (this.isConfigured) {
                // await setDoc(doc(this.firestore, 'users', userId), profileData);
            } else {
                await this.firestore.setDocument(`users/${userId}`, profileData);
            }
            
            return profileData;
        } catch (error) {
            console.error('Create user profile error:', error);
            throw error;
        }
    }
    
    async getUserProfile(userId) {
        try {
            if (this.isConfigured) {
                // const docRef = doc(this.firestore, 'users', userId);
                // const docSnap = await getDoc(docRef);
                // return docSnap.exists() ? docSnap.data() : null;
            } else {
                return await this.firestore.getDocument(`users/${userId}`);
            }
        } catch (error) {
            console.error('Get user profile error:', error);
            throw error;
        }
    }
    
    async updateUserProfile(userId, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            if (this.isConfigured) {
                // await updateDoc(doc(this.firestore, 'users', userId), updateData);
            } else {
                await this.firestore.updateDocument(`users/${userId}`, updateData);
            }
            
            return updateData;
        } catch (error) {
            console.error('Update user profile error:', error);
            throw error;
        }
    }
    
    async createExchangeRequest(userId, exchangeData) {
        try {
            const requestData = {
                userId,
                ...exchangeData,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: this.generateId()
            };
            
            if (this.isConfigured) {
                // await addDoc(collection(this.firestore, 'exchanges'), requestData);
            } else {
                await this.firestore.addDocument('exchanges', requestData);
            }
            
            return requestData;
        } catch (error) {
            console.error('Create exchange request error:', error);
            throw error;
        }
    }
    
    async getUserExchanges(userId) {
        try {
            if (this.isConfigured) {
                // const q = query(
                //     collection(this.firestore, 'exchanges'),
                //     where('userId', '==', userId),
                //     orderBy('createdAt', 'desc')
                // );
                // const querySnapshot = await getDocs(q);
                // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } else {
                return await this.firestore.queryDocuments('exchanges', {
                    where: { userId },
                    orderBy: { field: 'createdAt', direction: 'desc' }
                });
            }
        } catch (error) {
            console.error('Get user exchanges error:', error);
            throw error;
        }
    }
    
    async updateExchangeStatus(exchangeId, status, adminNotes = '') {
        try {
            const updateData = {
                status,
                adminNotes,
                updatedAt: new Date().toISOString()
            };
            
            if (this.isConfigured) {
                // await updateDoc(doc(this.firestore, 'exchanges', exchangeId), updateData);
            } else {
                await this.firestore.updateDocument(`exchanges/${exchangeId}`, updateData);
            }
            
            return updateData;
        } catch (error) {
            console.error('Update exchange status error:', error);
            throw error;
        }
    }
    
    // Storage methods
    async uploadFile(file, path, metadata = {}) {
        try {
            if (this.isConfigured) {
                // const storageRef = ref(this.storage, path);
                // const uploadTask = uploadBytesResumable(storageRef, file, metadata);
                // 
                // return new Promise((resolve, reject) => {
                //     uploadTask.on('state_changed',
                //         (snapshot) => {
                //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //             this.onUploadProgress?.(progress);
                //         },
                //         (error) => reject(error),
                //         async () => {
                //             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                //             resolve({ downloadURL, path });
                //         }
                //     );
                // });
            } else {
                return await this.storage.uploadFile(file, path, metadata);
            }
        } catch (error) {
            console.error('Upload file error:', error);
            throw error;
        }
    }
    
    async deleteFile(path) {
        try {
            if (this.isConfigured) {
                // const storageRef = ref(this.storage, path);
                // await deleteObject(storageRef);
            } else {
                await this.storage.deleteFile(path);
            }
        } catch (error) {
            console.error('Delete file error:', error);
            throw error;
        }
    }
    
    async getDownloadURL(path) {
        try {
            if (this.isConfigured) {
                // const storageRef = ref(this.storage, path);
                // return await getDownloadURL(storageRef);
            } else {
                return await this.storage.getDownloadURL(path);
            }
        } catch (error) {
            console.error('Get download URL error:', error);
            throw error;
        }
    }
    
    // Analytics methods
    logEvent(eventName, parameters = {}) {
        try {
            if (this.isConfigured) {
                // logEvent(this.analytics, eventName, parameters);
            } else {
                this.analytics.logEvent(eventName, parameters);
            }
        } catch (error) {
            console.error('Log event error:', error);
        }
    }
    
    setUserProperties(properties) {
        try {
            if (this.isConfigured) {
                // setUserProperties(this.analytics, properties);
            } else {
                this.analytics.setUserProperties(properties);
            }
        } catch (error) {
            console.error('Set user properties error:', error);
        }
    }
    
    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    handleAuthError(error) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado',
            'auth/wrong-password': 'Senha incorreta',
            'auth/email-already-in-use': 'Email já está em uso',
            'auth/weak-password': 'Senha muito fraca',
            'auth/invalid-email': 'Email inválido',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
        };
        
        return new Error(errorMessages[error.code] || error.message);
    }
    
    // Real-time listeners
    onUserProfileChange(userId, callback) {
        if (this.isConfigured) {
            // return onSnapshot(doc(this.firestore, 'users', userId), callback);
        } else {
            return this.firestore.onDocumentChange(`users/${userId}`, callback);
        }
    }
    
    onExchangeStatusChange(exchangeId, callback) {
        if (this.isConfigured) {
            // return onSnapshot(doc(this.firestore, 'exchanges', exchangeId), callback);
        } else {
            return this.firestore.onDocumentChange(`exchanges/${exchangeId}`, callback);
        }
    }
}

// Mock implementations for development
class MockAuth {
    constructor() {
        this.currentUser = null;
        this.users = new Map();
        this.authStateCallbacks = [];
    }
    
    async signUp(email, password, userData) {
        await this.delay(1000); // Simulate network delay
        
        if (this.users.has(email)) {
            throw new Error('auth/email-already-in-use');
        }
        
        const user = {
            uid: this.generateId(),
            email,
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        this.users.set(email, { ...user, password });
        this.currentUser = user;
        this.notifyAuthStateChange(user);
        
        return user;
    }
    
    async signIn(email, password) {
        await this.delay(800);
        
        const userData = this.users.get(email);
        if (!userData || userData.password !== password) {
            throw new Error('auth/wrong-password');
        }
        
        this.currentUser = { ...userData };
        delete this.currentUser.password;
        this.notifyAuthStateChange(this.currentUser);
        
        return this.currentUser;
    }
    
    async signOut() {
        await this.delay(300);
        this.currentUser = null;
        this.notifyAuthStateChange(null);
    }
    
    async resetPassword(email) {
        await this.delay(500);
        if (!this.users.has(email)) {
            throw new Error('auth/user-not-found');
        }
        // In real implementation, would send email
        console.log(`Password reset email sent to ${email}`);
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    onAuthStateChanged(callback) {
        this.authStateCallbacks.push(callback);
        // Call immediately with current state
        callback(this.currentUser);
        
        // Return unsubscribe function
        return () => {
            const index = this.authStateCallbacks.indexOf(callback);
            if (index > -1) {
                this.authStateCallbacks.splice(index, 1);
            }
        };
    }
    
    notifyAuthStateChange(user) {
        this.authStateCallbacks.forEach(callback => callback(user));
    }
    
    generateId() {
        return 'mock_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class MockFirestore {
    constructor() {
        this.data = new Map();
        this.listeners = new Map();
    }
    
    async setDocument(path, data) {
        await this.delay(300);
        this.data.set(path, { ...data });
        this.notifyListeners(path, data);
        return data;
    }
    
    async getDocument(path) {
        await this.delay(200);
        return this.data.get(path) || null;
    }
    
    async updateDocument(path, updates) {
        await this.delay(250);
        const existing = this.data.get(path) || {};
        const updated = { ...existing, ...updates };
        this.data.set(path, updated);
        this.notifyListeners(path, updated);
        return updated;
    }
    
    async addDocument(collection, data) {
        await this.delay(300);
        const id = this.generateId();
        const path = `${collection}/${id}`;
        const docData = { ...data, id };
        this.data.set(path, docData);
        return docData;
    }
    
    async queryDocuments(collection, query = {}) {
        await this.delay(400);
        const results = [];
        
        for (const [path, data] of this.data.entries()) {
            if (path.startsWith(`${collection}/`)) {
                let matches = true;
                
                if (query.where) {
                    for (const [field, value] of Object.entries(query.where)) {
                        if (data[field] !== value) {
                            matches = false;
                            break;
                        }
                    }
                }
                
                if (matches) {
                    results.push(data);
                }
            }
        }
        
        // Sort if orderBy is specified
        if (query.orderBy) {
            const { field, direction = 'asc' } = query.orderBy;
            results.sort((a, b) => {
                const aVal = a[field];
                const bVal = b[field];
                
                if (direction === 'desc') {
                    return bVal > aVal ? 1 : -1;
                } else {
                    return aVal > bVal ? 1 : -1;
                }
            });
        }
        
        return results;
    }
    
    onDocumentChange(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        this.listeners.get(path).push(callback);
        
        // Call immediately with current data
        const data = this.data.get(path);
        if (data) {
            callback({ data: () => data, exists: () => true });
        }
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(path) || [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    
    notifyListeners(path, data) {
        const callbacks = this.listeners.get(path) || [];
        callbacks.forEach(callback => {
            callback({ data: () => data, exists: () => true });
        });
    }
    
    generateId() {
        return 'doc_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class MockStorage {
    constructor() {
        this.files = new Map();
    }
    
    async uploadFile(file, path, metadata = {}) {
        await this.delay(1000 + Math.random() * 2000); // Simulate upload time
        
        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            path,
            metadata,
            uploadedAt: new Date().toISOString(),
            downloadURL: `https://mock-storage.com/${path}`
        };
        
        this.files.set(path, fileData);
        
        return {
            downloadURL: fileData.downloadURL,
            path
        };
    }
    
    async deleteFile(path) {
        await this.delay(300);
        this.files.delete(path);
    }
    
    async getDownloadURL(path) {
        await this.delay(200);
        const file = this.files.get(path);
        if (!file) {
            throw new Error('File not found');
        }
        return file.downloadURL;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class MockAnalytics {
    constructor() {
        this.events = [];
        this.userProperties = {};
    }
    
    logEvent(eventName, parameters = {}) {
        const event = {
            name: eventName,
            parameters,
            timestamp: new Date().toISOString()
        };
        
        this.events.push(event);
        console.log('Analytics Event:', event);
        
        // Keep only last 100 events
        if (this.events.length > 100) {
            this.events.splice(0, this.events.length - 100);
        }
    }
    
    setUserProperties(properties) {
        this.userProperties = { ...this.userProperties, ...properties };
        console.log('Analytics User Properties:', this.userProperties);
    }
    
    getEvents() {
        return [...this.events];
    }
    
    getUserProperties() {
        return { ...this.userProperties };
    }
}

// Initialize Firebase manager
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseManager = new FirebaseManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseManager;
}

