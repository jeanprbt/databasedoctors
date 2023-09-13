import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    setDoc,
    doc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { addCitiesToSelect, addSpecialitiesToSelect } from "./utils.js";

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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utils functions

// Add the options to the select element for city
const selectCity = document.getElementById("city");
addCitiesToSelect(selectCity)


// Add the options to the select element
const select = document.getElementById("speciality");
addSpecialitiesToSelect(select);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                // Signed in 
                const user = userCredential.user;

                // Adding name to Firebase auth
                await updateProfile(user, {
                    displayName: name,
                });

                // Sttoring user in doctors database
                await setDoc(doc(db, "doctors", user.uid), {
                    name: name,
                    age: age,
                    email: email,
                    speciality: speciality,
                    city: city,
                });

                console.log("Registration successful!");
                // Clear any previous error messages
                document.getElementById("registration-error").textContent = "";
                // Display successful registration message
                document.getElementById("registration-success").textContent =
                    "Registration successful !";

                // Redirect to user page
                window.location.href = "doctor.html";
            })
            .catch((error) => {
                console.error("Registration failed : ", error.message);
                // Clear any previous succesful error message
                document.getElementById("registration-success").textContent = "";
                // Display the error message to the user
                document.getElementById("registration-error").textContent =
                    getErrorMessageForFirebaseErrorCode(error.code);
            });
    });



