import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeiRIFp3pz2fNxMlGCsTc-NA7GviQghZU",
    authDomain: "database-project-bd7e8.firebaseapp.com",
    projectId: "database-project-bd7e8",
    storageBucket: "database-project-bd7e8.appspot.com",
    messagingSenderId: "771888139690",
    appId: "1:771888139690:web:6b1e5ee383ec06df976fd3",
};

// Initializations of Firebase, Firebase Authentication and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Restrict page to logged-in patient users
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "patients", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Add a welcome message
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.textContent = `Welcome ${user.displayName} !`;
        } else {
            window.location.href = "doctor.html"; // If user is a doctor, redirect to doctor page
        }
    } else {
        window.location.href = 'index.html'; // If user is not logged in, redirect to login page
    }
});

//THIS PART TAKES CARE OF GETTING THE PATIENTS APPOINTMENT

// Get the appointments  database
const appointments = collection(db, 'usedSlots');

// Query the Firebase database based on user input
let answer = query(appointments, where('patientId', '==', auth.currentUser.uid));
const querySnapshot = await getDocs(answer);

// Display the appointments
await displayAppointments(querySnapshot);

//Function to display the doctors found
async function displayAppointments(querySnapshot) {
    const appointmentsDiv = document.getElementById('appointments');
    appointmentsDiv.innerHTML = ''; // Clear previous results
    appointmentsDiv.style.visibility = 'visible';
    const apppointmentTitle = document.createElement('h2');

    if (querySnapshot.empty) {
        resultTitle.textContent = 'No doctor found for your requirements...';
        resultDiv.appendChild(resultTitle);
        return;
    } else {
        resultTitle.textContent = 'Results : ';
        resultDiv.appendChild(resultTitle);
    }

    //iterate over each
    querySnapshot.forEach((doc) => {

        const doctorData = doc.data();

        // Create a container for each doctor Card + calendar
        const doctorContainer = document.createElement('div');
        doctorContainer.classList.add('doctor-container');

        // Create elements to display doctor information (e.g., name, speciality, etc.)
        const doctorCard = document.createElement('div');
        doctorCard.classList.add('doctor-card');

        //Create elements for calendar + button
        const doctorCalendar = document.createElement('div');
        doctorCalendar.classList.add('doctor-calendar');

        // Add doctor information to the card

        const doctorName = document.createElement('h3');
        doctorName.textContent = doctorData.name;

        const doctorSpeciality = document.createElement('p');
        doctorSpeciality.textContent = `Speciality: ${doctorData.speciality}`;

        const doctorCity = document.createElement('p');
        doctorCity.textContent = `City: ${doctorData.city}`;

        const doctorEmail = document.createElement('p');
        doctorEmail.textContent = `Contact : ${doctorData.email}`;

        // Create a div for the calendar
        const calendarDiv = document.createElement('div');
        calendarDiv.classList.add('calendar');

        // Append the elements to the card
        doctorCard.appendChild(doctorName);
        doctorCard.appendChild(doctorSpeciality);
        doctorCard.appendChild(doctorCity);
        doctorCard.appendChild(doctorEmail);

        //Append element to the calendar division
        doctorCalendar.appendChild(calendarDiv);
        createCalendar(calendarDiv, doc);

        //Put both parts together
        doctorContainer.appendChild(doctorCard);
        doctorContainer.appendChild(doctorCalendar);

        // Append the full doctor info to the appointmentsDiv
        resultDiv.appendChild(doctorContainer);
    });
}
