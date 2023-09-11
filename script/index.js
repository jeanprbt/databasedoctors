 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
 import {
     getAuth,
     signInWithEmailAndPassword,
 } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
 import {
     getFirestore,
     getDoc,
     doc
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

 // Handle User Login
 document
     .getElementById("login-form")
     .addEventListener("submit", async (event) => {
         event.preventDefault();

         var email = document.getElementById("login-email").value;
         var password = document.getElementById("login-password").value;


         // Log in user with Firebase Authentication
         signInWithEmailAndPassword(auth, email, password)
             .then(async (userCredential) => {

                 // Clear any previous error messages
                 document.getElementById("login-error").textContent = "";
                 //  Display successful login message
                 document.getElementById("login-success").textContent =
                     "Login successful !";

                 const docRef = doc(db, "patients", userCredential.user.uid);
                 const docSnap = await getDoc(docRef);

                 if (docSnap.exists()) {
                     window.location.href = "patient.html";
                 } else {
                     window.location.href = "doctor.html";
                 }

             }).catch((error) => {
                 console.error("Login failed : " + error.message);
                 // Clear any previous succeful errpr message
                 document.getElementById("login-success").textContent = "";
                 // Display error message
                 document.getElementById("login-error").textContent =
                     getErrorMessageForFirebaseErrorCode(error.code);
             });
     });

 // Define the getErrorMessageForFirebaseErrorCode function
 function getErrorMessageForFirebaseErrorCode(errorCode) {
     switch (errorCode) {
         case "auth/email-already-in-use":
             return "The email address is already in use by another account.";
         case "auth/invalid-email":
             return "Invalid email address. Please check the email format.";
         case "auth/weak-password":
             return "The password is too weak. Please use a stronger password.";
         case "auth/user-not-found":
             return "User not found. Please check your email or register.";
         case "auth/wrong-password":
             return "Incorrect password. Please try again.";
         // Add more cases for other error codes as needed
         default:
             return "An error occurred. Please try again later.";
     }
 }