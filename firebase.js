// firebase.js - SAFE to publish on GitHub
// This file contains only the initialization, NOT your API keys

console.log("Firebase loading...");

// Your Firebase configuration - REPLACE THESE VALUES IN GITHUB
const firebaseConfig = {
    apiKey: "REPLACE_WITH_YOUR_API_KEY",
    authDomain: "noor-deenil-islam.firebaseapp.com",
    projectId: "noor-deenil-islam",
    storageBucket: "noor-deenil-islam.firebasestorage.app",
    messagingSenderId: "877357858645",
    appId: "1:877357858645:web:7cdc0e9001f3f63eb39dc"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();

console.log("Firebase initialized successfully!");

// Export to global scope
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
window.googleProvider = googleProvider;
window.githubProvider = githubProvider;
