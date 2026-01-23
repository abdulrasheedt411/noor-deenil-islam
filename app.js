// app.js - Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const googleLoginBtn = document.getElementById('google-login');
    const githubLoginBtn = document.getElementById('github-login');
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const loginContainer = document.getElementById('login-container');
    const userContainer = document.getElementById('user-container');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userPhoto = document.getElementById('user-photo');
    const joinDate = document.getElementById('join-date');
    const messagePopup = document.getElementById('message-popup');
    const messageText = document.getElementById('message-text');

    // Check if Firebase is loaded
    if (!window.firebaseAuth) {
        showMessage("Error: Firebase not loaded. Please refresh the page.", "error");
        return;
    }

    const auth = window.firebaseAuth;
    const db = window.firebaseDB;
    const googleProvider = window.googleProvider;
    const githubProvider = window.githubProvider;

    // Login with Google
    googleLoginBtn.addEventListener('click', function() {
        loginWithProvider(googleProvider, 'Google');
    });

    // Login with GitHub
    githubLoginBtn.addEventListener('click', function() {
        loginWithProvider(githubProvider, 'GitHub');
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        auth.signOut().then(() => {
            showMessage("Logged out successfully!", "success");
        }).catch(error => {
            showMessage("Logout failed: " + error.message, "error");
        });
    });

    // Dashboard button
    dashboardBtn.addEventListener('click', function() {
        showMessage("Dashboard coming soon!", "info");
        // You can redirect to dashboard page here
        // window.location.href = "dashboard.html";
    });

    // Auth state listener
    auth.onAuthStateChanged(async function(user) {
        if (user) {
            // User is signed in
            updateUserUI(user);
            loginContainer.style.display = 'none';
            userContainer.style.display = 'block';
            
            // Save/update user data in Firestore
            await saveUserToFirestore(user);
        } else {
            // User is signed out
            loginContainer.style.display = 'block';
            userContainer.style.display = 'none';
        }
    });

    // Login function
    async function loginWithProvider(provider, providerName) {
        try {
            showMessage(`Signing in with ${providerName}...`, "info");
            const result = await auth.signInWithPopup(provider);
            showMessage(`Welcome ${result.user.displayName}!`, "success");
        } catch (error) {
            console.error("Login error:", error);
            
            // User-friendly error messages
            if (error.code === 'auth/popup-blocked') {
                showMessage("Popup blocked! Please allow popups for this site.", "error");
            } else if (error.code === 'auth/cancelled-popup-request') {
                // User cancelled, no message needed
            } else {
                showMessage(`Login failed: ${error.message}`, "error");
            }
        }
    }

    // Update user interface
    function updateUserUI(user) {
        userName.textContent = user.displayName || "User";
        userEmail.textContent = user.email || "No email provided";
        
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.style.display = 'block';
        } else {
            userPhoto.style.display = 'none';
        }
        
        // Format join date
        const joinDateObj = user.metadata.creationTime ? 
            new Date(user.metadata.creationTime) : new Date();
        joinDate.textContent = joinDateObj.toLocaleDateString();
    }

    // Save user to Firestore
    async function saveUserToFirestore(user) {
        try {
            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            
            const userData = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                provider: user.providerData[0]?.providerId,
                lastLogin: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (!userDoc.exists) {
                // New user
                userData.createdAt = new Date().toISOString();
                userData.memberSince = new Date().toISOString();
                await userRef.set(userData);
                console.log("New user saved to Firestore");
            } else {
                // Existing user - update last login
                await userRef.update({
                    lastLogin: userData.lastLogin,
                    updatedAt: userData.updatedAt
                });
                console.log("User login updated in Firestore");
            }
        } catch (error) {
            console.error("Error saving user to Firestore:", error);
        }
    }

    // Show message function
    function showMessage(text, type) {
        messageText.textContent = text;
        messagePopup.className = `popup show ${type}`;
        
        setTimeout(() => {
            messagePopup.classList.remove('show');
        }, 4000);
    }

    // Initialize
    console.log("App initialized successfully");
});
