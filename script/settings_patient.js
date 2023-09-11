import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    updateEmail,
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeiRIFp3pz2fNxMlGCsTc-NA7GviQghZU",
    authDomain: "database-project-bd7e8.firebaseapp.com",
    projectId: "database-project-bd7e8",
    storageBucket: "database-project-bd7e8.appspot.com",
    messagingSenderId: "771888139690",
    appId: "1:771888139690:web:6b1e5ee383ec06df976fd3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Handle profile settings
var user = auth.currentUser;

// Function to change user's email
document
    .getElementById('email-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault()

        const newEmail = document.getElementById('new-email').value;

        updateEmail(newEmail)
            .then(async () => {

                // Changing user email field in Firestore
                await updateDoc((db, "patients", user.uid), {
                    email: newEmail
                })

                console.log("Email change successful !")
                // Clear any previous error messages
                document.getElementById("email-error").textContent = "";
                //  Display successful login message
                document.getElementById("email-success").textContent =
                    "Email changed succesfully !";
            })
            .catch((error) => {
                console.error("Email change failed : ", error.message);
                // Clear any previous succeful error message
                document.getElementById("email-success").textContent = "";
                // Display error message
                document.getElementById("email-error").textContent = "Email change failed."
            });
    })



// Function to change user's password
function changePassword() {
    const newPassword = document.getElementById('newPassword').value;

    updatePassword(newPassword)
        .then(() => {
            alert('Password updated successfully');
        })
        .catch((error) => {
            alert(`Error updating password: ${error.message}`);
        });
}

// Function to update user's profile (name and age)
function updateProfile() {
    const newName = document.getElementById('newName').value;
    const newAge = document.getElementById('newAge').value;

    firestore.collection('patients').doc(user.uid)
        .update({
            name: newName,
            age: parseInt(newAge)
        })
        .then(() => {
            alert('Profile updated successfully');
        })
        .catch((error) => {
            alert(`Error updating profile: ${error.message}`);
        });
}

// Function to sign out
function signOut() {
    firebase.auth().signOut()
        .then(() => {
            alert('Sign Out Successful');
        })
        .catch((error) => {
            alert(`Error signing out: ${error.message}`);
        });
}

// Check if the user is logged in
auth.onAuthStateChanged((new_user) => {
    if (new_user) {
        user = new_user;
    } else {
        // Redirect to the login page or handle the user being logged out
    }
});