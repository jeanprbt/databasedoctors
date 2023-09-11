// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query
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

 // Define an array of allowed cities in Sweden
 const allowedPlaces = [
    "All Cities",
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

const specialities = [
    "All Specialities",
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



// Handle Account Status
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location = 'index.html'; // If User is not logged in, redirect to login page
    }
});

const user = auth.currentUser;

// Add a welcome message
const welcomeMessage = document.createElement('h2');
welcomeMessage.textContent = `Welcome ${user}`;
const main = document.querySelector('main');
main.insertBefore(welcomeMessage, main.firstChild);

// Add a sign out link in the navigation bar

const signOutLink = document.getElementById('sign-out');
signOutLink.addEventListener('click', signOutUser);


function signOutUser() {
    signOut(auth).then(() => {
        console.log("Sign out succesful.");
    }).catch((error) => {
        console.log("An error happened during sign out.");
    });
}

//Function to display
function displaySearchResults(querySnapshot) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    if (querySnapshot.empty) {
        resultDiv.textContent = 'No doctors found.';
        return;
    }

    querySnapshot.forEach((doc) => {
        const doctorData = doc.data();

        // Create elements to display doctor information (e.g., name, speciality, etc.)
        const doctorCard = document.createElement('div');
        doctorCard.classList.add('doctor-card');
        // Add doctor information to the card

        const doctorName = document.createElement('h3');
        doctorName.textContent = doctorData.name;

        const doctorSpeciality = document.createElement('p');
        doctorSpeciality.textContent = `Speciality: ${doctorData.speciality}`;

        const doctorCity = document.createElement('p');
        doctorCity.textContent = `City: ${doctorData.city}`;

        const doctorEmail = document.createElement('p'); 
        doctorEmail.textContent = `Contact : ${doctorData.email}`; 



        // You can add more elements to display other doctor information as needed

        // Append the elements to the card
        doctorCard.appendChild(doctorName);
        doctorCard.appendChild(doctorSpeciality);
        doctorCard.appendChild(doctorCity);
        doctorCard.appendChild(doctorEmail)

        // Append the card to the appointmentsDiv
        resultDiv.appendChild(doctorCard);
    });
}

// Get the doctors database
const doctorsDB = collection(db, 'doctors');
const searchForm = document.querySelector('form');
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Collect user input
    const speciality = document.getElementById('speciality').value;
    // const date = document.getElementById('date').value;
    const city = document.getElementById('city').value;

    // Query the Firebase database based on user input
    let answer = query(doctorsDB);

    if (speciality !== 'All Specialities') {
        answer = query(answer, where('speciality', '==', speciality));
    }

    //TODO, gérer la date
    //if (date !== '') {
    //answer = ;
    //}

    if (city !== 'All Cities') {
        answer = query(answer, where('city', '==', city));
    }
    // Execute the query
    const querySnapshot = await getDocs(answer);

    // Display the search results
    displaySearchResults(querySnapshot);
});