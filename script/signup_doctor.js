 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
 import {
     getAuth,
     createUserWithEmailAndPassword,
 } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
 import {
     getFirestore,
     setDoc,
     doc,
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

 // Handle User Registration
 document
     .getElementById("registration-form")
     .addEventListener("submit", async (e) => {

         e.preventDefault();

         const email = document.getElementById("email").value;
         const password = document.getElementById("password").value;
         const name = document.getElementById("name").value;
         const age = document.getElementById("age").value;
         const speciality = document.getElementById("speciality").value;
         const city = document.getElementById("city").value;

         createUserWithEmailAndPassword(auth, email, password)
             .then(async (userCredential) => {

                 const user = userCredential.user;

                 // Adding name to Firebase auth
                 await updateProfile(user, {
                     displayName: name
                 })

                 // Storing user in doctors database
                 await setDoc(doc(db, "doctors", user.uid), {
                     name: name,
                     age: age,
                     email: email,
                     speciality: speciality,
                     city: city,
                 });

                 console.log(`User successfully registered with email ${email} and name ${name}.`);
                 // Clear any previous error messages
                 document.getElementById("registration-error").textContent = "";
                 // Display successful registration message
                 document.getElementById("registration-success").textContent = "Registration successful !";
             })
             .catch((error) => {
                 console.error("Registration failed : ", error.message);
                 // Clear any previous successful error message
                 document.getElementById("registration-success").textContent = "";
                 // Display the error message to the user
                 document.getElementById("registration-error").textContent = getErrorMessageForFirebaseErrorCode(error.code);
             });
     });

 // Define an array of allowed cities in Sweden
 const allowedPlaces = [
     "Stockholm",
     "Gothenburg",
     "Malmö",
     "Uppsala",
     "Västerås",
     "Örebro",
     "Linköping",
     "Helsingborg",
     "Jönköping",
     "Norrköping",
     "Lund",
     "Umeå",
 ];

 // Add the options to the select element for city
 const selectCity = document.getElementById("city");
 for (let i = 0; i < allowedPlaces.length; i++) {
     const option = document.createElement("option");
     option.value = allowedPlaces[i];
     option.text = allowedPlaces[i];
     selectCity.appendChild(option);
 }

 // Define an array of allowed specialities
 const specialities = [
     "Cardiology",
     "Dentistry",
     "Dermatology",
     "Orthopedics",
     "Neurology",
     "Pediatrics",
     "Oncology",
     "Psychiatry",
     "Radiology",
     "Ophthalmology",
     "Gynecology",
 ];

 // Add the options to the select element
 const select = document.getElementById("speciality");
 for (let i = 0; i < specialities.length; i++) {
     const option = document.createElement("option");
     option.value = specialities[i];
     option.text = specialities[i];
     select.appendChild(option);
 }


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