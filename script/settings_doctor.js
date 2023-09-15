import {initializeApp} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    updateEmail,
    updateProfile,
    updatePassword,
    onAuthStateChanged,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    updateDoc,
    deleteDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { addCitiesToSelect, addSpecialitiesToSelect, signOutButton } from "./utils.js";

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utils functions 

// Handle sign-out
signOutButton(document.getElementById('sign-out'), auth);

// Add the options to the select element for city
const selectCity = document.getElementById("city");
addCitiesToSelect(selectCity)

// Add the options to the select element
const select = document.getElementById("speciality");
addSpecialitiesToSelect(select);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let currentUser;

// Restrict page to logged-in users
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;

        // Fill form fields with current data
        document.getElementById('new-email').value = currentUser.email;
        document.getElementById('new-name').value = currentUser.displayName;
        getDoc(doc(db, "doctors", currentUser.uid)).then((doc) => {
            if (doc.exists()) {
                document.getElementById('new-age').value = doc.data().age;
                document.getElementById('city').value = doc.data().city;
                document.getElementById('speciality').value = doc.data().speciality;
            } else {
                console.log("No such document, user must be a patient !");
                window.location.href = "patient.html";
            }
        })
    } else {
        window.location.href = 'index.html'; // If user is not logged in, redirect to login page
    }
});

// Handle back button redirection
document.getElementById("button-back").addEventListener("click", function() {
    window.location.href = "patient.html";
})

// Handle email change
document
    .getElementById('email-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault()

        const newEmail = document.getElementById('new-email').value;

        updateEmail(currentUser, newEmail)
            .then(async () => {

                // Changing user email field in Firestore
                await updateDoc(doc(db, "doctors", currentUser.uid), {
                    email: newEmail
                })

                console.log(`Email changed successfully to ${newEmail}.`)
                // Clear any previous error messages
                document.getElementById("email-error").textContent = "";
                //  Display successful login message
                document.getElementById("email-success").textContent =
                    "Email changed successfully !";
            })
            .catch((error) => {
                console.error("Email change failed : ", error.message);
                // Clear any previous succeful error message
                document.getElementById("email-success").textContent = "";
                // Display error message
                document.getElementById("email-error").textContent = "Email change failed."
            });
    })

// Handle password change
document
    .getElementById('password-form')
    .addEventListener('submit', async (event) => {

        event.preventDefault();
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);

        reauthenticateWithCredential(currentUser, credential).then(() => {
            // User re-authenticated.
            updatePassword(currentUser, newPassword)
                .then(async () => {
                    console.log(`Password changed successfully.`)
                    // Clear any previous error messages
                    document.getElementById("password-error").textContent = "";
                    //  Display successful login message
                    document.getElementById("password-success").textContent = "Password changed successfully !";
                })
                .catch((error) => {
                    console.error("Password change failed : ", error.message);
                    // Clear any previous succeful error message
                    document.getElementById("password-success").textContent = "";
                    // Display error message
                    document.getElementById("password-error").textContent = "Password change failed."
                })
        }).catch((error) => {
            console.error("Re-authentication failed : ", error.message);
            // Clear any previous succeful error message
            document.getElementById("password-success").textContent = "";
            // Display error message
            document.getElementById("password-error").textContent = "The old password you entered is wrong."
        });
    })

// Handle name change
document
    .getElementById('name-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault()

        const newName = document.getElementById('new-name').value;

        updateProfile(currentUser, {displayName : newName})
            .then(async () => {

                // Changing name field in Firestore
                await updateDoc(doc(db, "doctors", currentUser.uid), {
                    name: newName
                })

                console.log(`Name changed successfully to ${newName}.`)
                // Clear any previous error messages
                document.getElementById("name-error").textContent = "";
                //  Display successful login message
                document.getElementById("name-success").textContent =
                    "Name changed successfully !";
            })
            .catch((error) => {
                console.error("Name change failed : ", error.message);
                // Clear any previous succeful error message
                document.getElementById("name-success").textContent = "";
                // Display error message
                document.getElementById("name-error").textContent = "Name change failed."
            });
    })

// Handle age change
document
    .getElementById('age-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault()
        const newAge = document.getElementById('new-age').value;
        // Changing age in Firestore
        await updateDoc(doc(db, "doctors", currentUser.uid), {
            age: newAge
        }).then(() => {
            console.log(`Age changed successfully to ${newAge}.`)
            // Clear any previous error messages
            document.getElementById("age-error").textContent = "";
            //  Display successful login message
            document.getElementById("age-success").textContent =
                "Age changed successfully !";
        }).catch((error) => {
            console.error("Name change failed : ", error.message);
            // Clear any previous succeful error message
            document.getElementById("age-success").textContent = "";
            // Display error message
            document.getElementById("age-error").textContent = "Age change failed."
        })
    })

document
    .getElementById('city-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault()
        const newCity = document.getElementById('city').value;
        // Changing city in Firestore
        await updateDoc(doc(db, "doctors", currentUser.uid), {
            city: newCity
        }).then(() => {
            console.log(`City changed successfully to ${newCity}.`)
            // Clear any previous error messages
            document.getElementById("city-error").textContent = "";
            //  Display successful login message
            document.getElementById("city-success").textContent =
                "City changed successfully !";
        }).catch((error) => {
            console.error("City change failed : ", error.message);
            // Clear any previous succeful error message
            document.getElementById("city-success").textContent = "";
            // Display error message
            document.getElementById("city-error").textContent = "City change failed."
        })
    })

document
    .getElementById('speciality-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault()
        const newSpeciality = document.getElementById('speciality').value;
        // Changing speciality in Firestore
        await updateDoc(doc(db, "doctors", currentUser.uid), {
            speciality: newSpeciality
        }).then(() => {
            console.log(`Speciality changed successfully to ${newSpeciality}.`)
            // Clear any previous error messages
            document.getElementById("speciality-error").textContent = "";
            //  Display successful login message
            document.getElementById("speciality-success").textContent =
                "Speciality changed successfully !";
        }).catch((error) => {
            console.error("Speciality change failed : ", error.message);
            // Clear any previous succeful error message
            document.getElementById("speciality-success").textContent = "";
            // Display error message
            document.getElementById("speciality-error").textContent = "Speciality change failed."
        })
    })


// Handle account deletion
document
    .getElementById("delete-button")
    .addEventListener('click', async (event) => {
        event.preventDefault()
        if(confirm("Are you sure you want to delete your account ?")){

            const password = document.getElementById('current-password').value;
            const credential = EmailAuthProvider.credential(currentUser.email, password);

            reauthenticateWithCredential(currentUser, credential).then(async() => {

                // Delete account in Firestore
                await deleteDoc(doc(db, "patients", currentUser.uid)).then(() => {
                    console.log("User successfully deleted from Firestore.")
                }).catch((error) => {
                    console.error("Account deletion from Firestore failed : ", error.message)
                })

                currentUser.delete()
                    .then(async () => {
                        console.log("User account successfully deleted.")
                    }).catch((error) => {
                    console.error("Account deletion failed : ", error.message);
                })

            }).catch((error) => {
                console.error("Re-authentication failed : ", error.message);
                // Clear any previous successful error message
                document.getElementById("delete-success").textContent = "";
                // Display error message
                document.getElementById("delete-error").textContent = "The password you entered is wrong."
            });
        }
    })