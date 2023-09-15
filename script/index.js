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
 import { getErrorMessageForFirebaseErrorCode } from "./utils";

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

 