import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getErrorMessageForFirebaseErrorCode } from "./utils";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeiRIFp3pz2fNxMlGCsTc-NA7GviQghZU",
    authDomain: "database-project-bd7e8.firebaseapp.com",
    projectId: "database-project-bd7e8",
    storageBucket: "database-project-bd7e8.appspot.com",
    messagingSenderId: "771888139690",
    appId: "1:771888139690:web:6b1e5ee383ec06df976fd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Handle User Registration
document
    .getElementById("registration-form")
    .addEventListener('submit', async (e) => {

        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                const user = userCredential.user;

                // Adding name to Firebase auth
                await updateProfile(user, {
                    displayName: name
                })

                // Storing user in patients database
                await setDoc(doc(db, "patients", user.uid), {
                    name: name,
                    age: age,
                    email: email
                });

                console.log(`User successfully registered with email ${email} and name ${name}.`);
                // Clear any previous error messages
                document.getElementById('registration-error').textContent = '';
                // Display successful registration message
                document.getElementById('registration-success').textContent = 'Registration successful !'

                // Redirect to user page
                window.location.href = "patient.html";

            })
            .catch((error) => {
                console.error('Registration failed :', error.message);
                // Clear any previous succesful error message
                document.getElementById('registration-success').textContent = '';
                // Display error messageÒ
                document.getElementById('registration-error').textContent = getErrorMessageForFirebaseErrorCode(error.code);
            });
    });